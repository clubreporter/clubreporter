-- ClubReporter — run this entire file in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users — subscription & onboarding fields)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  profile_type text check (profile_type in ('club', 'media')),
  media_outlet_name text,
  media_verification_info text,
  subscription_plan text default 'club'
    check (subscription_plan in ('club', 'county', 'presspass', 'basic', 'premium', 'media')),
  subscription_status text default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Club
-- ---------------------------------------------------------------------------
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  county text,
  primary_colour text,
  secondary_colour text,
  accent_colour text,
  logo text,
  founded text,
  ground text,
  website text,
  bio text,
  contact_email text,
  contact_phone text,
  grades jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clubs_user_id_idx on public.clubs (user_id);

-- ---------------------------------------------------------------------------
-- Player
-- ---------------------------------------------------------------------------
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  number text,
  position text,
  team text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_user_id_idx on public.players (user_id);
create index if not exists players_team_idx on public.players (team);

-- ---------------------------------------------------------------------------
-- Team (opponents)
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teams_user_id_idx on public.teams (user_id);

-- ---------------------------------------------------------------------------
-- Venue
-- ---------------------------------------------------------------------------
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists venues_user_id_idx on public.venues (user_id);

-- ---------------------------------------------------------------------------
-- Sponsor
-- ---------------------------------------------------------------------------
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  logo_url text,
  website_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sponsors_user_id_idx on public.sponsors (user_id);

-- ---------------------------------------------------------------------------
-- Match
-- ---------------------------------------------------------------------------
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  club_id uuid references public.clubs (id) on delete set null,
  sport text not null default 'gaelic_football'
    check (sport in ('gaelic_football', 'hurling', 'camogie', 'ladies_football')),
  home_team_name text not null,
  away_team_name text not null,
  competition text,
  category text,
  match_date timestamptz,
  venue text,
  referee text,
  weather text,
  attendance text,
  sponsor_name text,
  sponsor_logo text,
  sponsor_link text,
  template text default 'quick' check (template in ('quick', 'full', 'report_only')),
  status text not null default 'scheduled'
    check (status in (
      'scheduled', 'live', 'half_time', 'full_time', 'extra_time',
      'penalties', 'postponed', 'abandoned'
    )),
  home_goals integer not null default 0,
  home_points integer not null default 0,
  away_goals integer not null default 0,
  away_points integer not null default 0,
  half_time_home text,
  half_time_away text,
  public_id text unique,
  report_published boolean not null default false,
  photos text[] not null default '{}',
  home_lineup text[] not null default '{}',
  home_subs text[] not null default '{}',
  away_lineup text[] not null default '{}',
  away_subs text[] not null default '{}',
  report_draft text,
  player_of_match text,
  current_minute text,
  last_incident_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists matches_user_id_idx on public.matches (user_id);
create index if not exists matches_public_id_idx on public.matches (public_id);
create index if not exists matches_club_id_idx on public.matches (club_id);
create index if not exists matches_match_date_idx on public.matches (match_date desc);

-- ---------------------------------------------------------------------------
-- MatchIncident
-- ---------------------------------------------------------------------------
create table if not exists public.match_incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  match_id uuid not null references public.matches (id) on delete cascade,
  type text not null,
  minute text,
  team text check (team in ('home', 'away')),
  player text,
  details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists match_incidents_match_id_idx on public.match_incidents (match_id);
create index if not exists match_incidents_created_at_idx on public.match_incidents (created_at);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'clubs', 'players', 'teams', 'venues', 'sponsors', 'matches', 'match_incidents'
  ]
  loop
    execute format('
      drop trigger if exists set_%s_updated_at on public.%s;
      create trigger set_%s_updated_at
        before update on public.%s
        for each row execute function public.set_updated_at();
    ', t, t, t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, subscription_plan, subscription_status)
  values (new.id, new.email, 'club', 'trialing')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Delete account (removes all user data + profile; auth user via client signOut)
-- ---------------------------------------------------------------------------
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  delete from public.match_incidents where user_id = uid;
  delete from public.matches where user_id = uid;
  delete from public.players where user_id = uid;
  delete from public.sponsors where user_id = uid;
  delete from public.teams where user_id = uid;
  delete from public.venues where user_id = uid;
  delete from public.clubs where user_id = uid;
  delete from public.profiles where id = uid;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.players enable row level security;
alter table public.teams enable row level security;
alter table public.venues enable row level security;
alter table public.sponsors enable row level security;
alter table public.matches enable row level security;
alter table public.match_incidents enable row level security;

-- Profiles
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Clubs
create policy "Users manage own clubs" on public.clubs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Players
create policy "Users manage own players" on public.players for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Teams
create policy "Users manage own teams" on public.teams for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Venues
create policy "Users manage own venues" on public.venues for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Sponsors
create policy "Users manage own sponsors" on public.sponsors for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Matches — owner CRUD + public read by public_id
create policy "Users manage own matches" on public.matches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read matches by public_id" on public.matches for select using (public_id is not null and public_id <> '');

-- Match incidents — owner CRUD + public read when match is public
create policy "Users manage own incidents" on public.match_incidents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read incidents for public matches" on public.match_incidents for select using (
  exists (
    select 1 from public.matches m
    where m.id = match_id and m.public_id is not null and m.public_id <> ''
  )
);

-- ---------------------------------------------------------------------------
-- Storage (logos & match photos)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('clubreporter', 'clubreporter', true)
on conflict (id) do nothing;

create policy "Authenticated users upload files"
on storage.objects for insert to authenticated
with check (bucket_id = 'clubreporter' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users update own files"
on storage.objects for update to authenticated
using (bucket_id = 'clubreporter' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users delete own files"
on storage.objects for delete to authenticated
using (bucket_id = 'clubreporter' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Public read clubreporter files"
on storage.objects for select
using (bucket_id = 'clubreporter');

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant select on public.matches to anon;
grant select on public.match_incidents to anon;

-- ---------------------------------------------------------------------------
-- Multi-sport migration (run if upgrading existing database)
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists primary_sport text
  check (primary_sport in ('gaa', 'soccer', 'rugby', 'multi', 'media'));

alter table public.matches drop constraint if exists matches_sport_check;
alter table public.matches add constraint matches_sport_check
  check (sport in ('gaelic_football', 'hurling', 'camogie', 'ladies_football', 'soccer', 'rugby'));
grant execute on function public.delete_user_account() to authenticated;

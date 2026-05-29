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
  profile_type text check (profile_type in ('club', 'fan', 'media')),
  media_outlet_name text,
  media_verification_info text,
  subscription_plan text default 'free'
    check (subscription_plan in ('free', 'club', 'county', 'presspass', 'basic', 'premium', 'media')),
  subscription_status text default 'active'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  role text default 'user' check (role in ('user', 'admin')),
  is_admin boolean not null default false,
  account_suspended boolean not null default false,
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
  values (new.id, new.email, 'free', 'active')
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

alter table public.profiles add column if not exists stripe_customer_id text;

alter table public.matches drop constraint if exists matches_sport_check;
alter table public.matches add constraint matches_sport_check
  check (sport in ('gaelic_football', 'hurling', 'camogie', 'ladies_football', 'soccer', 'rugby'));
grant execute on function public.delete_user_account() to authenticated;

-- ---------------------------------------------------------------------------
-- Fan accounts & Free plan migration (run if upgrading existing database)
-- ---------------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_profile_type_check;
alter table public.profiles add constraint profiles_profile_type_check
  check (profile_type in ('club', 'fan', 'media'));

alter table public.profiles drop constraint if exists profiles_subscription_plan_check;
alter table public.profiles add constraint profiles_subscription_plan_check
  check (subscription_plan in ('free', 'club', 'county', 'presspass', 'basic', 'premium', 'media'));

alter table public.profiles alter column subscription_plan set default 'free';
alter table public.profiles alter column subscription_status set default 'active';

-- ---------------------------------------------------------------------------
-- Club verification (Verified Club accounts)
-- ---------------------------------------------------------------------------
alter table public.clubs add column if not exists verification_status text not null default 'unverified'
  check (verification_status in ('unverified', 'pending', 'approved', 'rejected'));
alter table public.clubs add column if not exists verification_method text
  check (verification_method is null or verification_method in ('proof_upload', 'invite_link'));
alter table public.clubs add column if not exists verification_proof_url text;
alter table public.clubs add column if not exists verification_message text;
alter table public.clubs add column if not exists verification_submitted_at timestamptz;
alter table public.clubs add column if not exists verified_at timestamptz;
alter table public.clubs add column if not exists rejection_reason text;

create table if not exists public.club_invite_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  club_name text,
  email text,
  created_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  used_at timestamptz,
  used_by_user_id uuid references auth.users (id) on delete set null,
  club_id uuid references public.clubs (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists club_invite_tokens_token_idx on public.club_invite_tokens (token);

alter table public.club_invite_tokens enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Submit verification request (proof upload or invite link request)
create or replace function public.submit_club_verification(
  p_club_id uuid,
  p_method text,
  p_proof_url text default null,
  p_message text default null
)
returns public.clubs
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.clubs;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_method not in ('proof_upload', 'invite_link') then
    raise exception 'Invalid verification method';
  end if;

  update public.clubs
  set
    verification_status = 'pending',
    verification_method = p_method,
    verification_proof_url = case when p_method = 'proof_upload' then p_proof_url else verification_proof_url end,
    verification_message = coalesce(p_message, verification_message),
    verification_submitted_at = now(),
    rejection_reason = null
  where id = p_club_id and user_id = auth.uid()
  returning * into c;

  if c.id is null then
    raise exception 'Club not found';
  end if;

  return c;
end;
$$;

-- Redeem one-time invite token → auto-approve club
create or replace function public.redeem_club_invite_token(p_token text)
returns public.clubs
language plpgsql
security definer
set search_path = public
as $$
declare
  tok public.club_invite_tokens;
  c public.clubs;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into tok
  from public.club_invite_tokens
  where token = trim(p_token) and used_at is null and expires_at > now()
  limit 1;

  if tok.id is null then
    raise exception 'Invalid or expired invite link';
  end if;

  if tok.email is not null and tok.email <> (select email from public.profiles where id = auth.uid()) then
    raise exception 'This invite link is for a different email address';
  end if;

  select * into c from public.clubs where user_id = auth.uid() order by created_at asc limit 1;

  if c.id is null then
    insert into public.clubs (user_id, name, county, verification_status, verification_method, verification_submitted_at, verified_at)
    values (
      auth.uid(),
      coalesce(tok.club_name, 'My Club'),
      null,
      'approved',
      'invite_link',
      now(),
      now()
    )
    returning * into c;
  else
    update public.clubs
    set
      name = coalesce(tok.club_name, name),
      verification_status = 'approved',
      verification_method = 'invite_link',
      verification_submitted_at = now(),
      verified_at = now(),
      rejection_reason = null
    where id = c.id
    returning * into c;
  end if;

  update public.club_invite_tokens
  set used_at = now(), used_by_user_id = auth.uid(), club_id = c.id
  where id = tok.id;

  update public.profiles set profile_type = 'club' where id = auth.uid();

  return c;
end;
$$;

create or replace function public.admin_approve_club(p_club_id uuid)
returns public.clubs
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.clubs;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  update public.clubs
  set verification_status = 'approved', verified_at = now(), rejection_reason = null
  where id = p_club_id
  returning * into c;

  if c.id is null then
    raise exception 'Club not found';
  end if;

  return c;
end;
$$;

create or replace function public.admin_reject_club(p_club_id uuid, p_reason text default null)
returns public.clubs
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.clubs;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  update public.clubs
  set verification_status = 'rejected', rejection_reason = p_reason, verified_at = null
  where id = p_club_id
  returning * into c;

  if c.id is null then
    raise exception 'Club not found';
  end if;

  return c;
end;
$$;

create or replace function public.admin_create_club_invite(
  p_club_name text default null,
  p_email text default null,
  p_expires_days integer default 14
)
returns public.club_invite_tokens
language plpgsql
security definer
set search_path = public
as $$
declare
  tok public.club_invite_tokens;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  insert into public.club_invite_tokens (club_name, email, created_by, expires_at)
  values (p_club_name, p_email, auth.uid(), now() + make_interval(days => greatest(p_expires_days, 1)))
  returning * into tok;

  return tok;
end;
$$;

create or replace function public.get_public_match_publisher(p_public_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'profileType', p.profile_type,
    'mediaOutletName', p.media_outlet_name,
    'clubName', c.name,
    'clubVerificationStatus', c.verification_status,
    'clubVerifiedAt', c.verified_at
  )
  into result
  from public.matches m
  join public.profiles p on p.id = m.user_id
  left join public.clubs c on c.id = m.club_id
  where m.public_id = p_public_id
  limit 1;

  return coalesce(result, '{}'::jsonb);
end;
$$;

grant execute on function public.submit_club_verification(uuid, text, text, text) to authenticated;
grant execute on function public.redeem_club_invite_token(text) to authenticated;
grant execute on function public.admin_approve_club(uuid) to authenticated;
grant execute on function public.admin_reject_club(uuid, text) to authenticated;
grant execute on function public.admin_create_club_invite(text, text, integer) to authenticated;
grant execute on function public.get_public_match_publisher(text) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- Admins can read all clubs for verification queue
create policy "Admins read all clubs" on public.clubs for select using (public.is_admin());
create policy "Admins update all clubs" on public.clubs for update using (public.is_admin());

create policy "Admins manage invite tokens" on public.club_invite_tokens for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own redeemed invite tokens" on public.club_invite_tokens for select using (used_by_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Platform admin (is_admin flag + dashboard RPCs)
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists account_suspended boolean not null default false;

update public.profiles set is_admin = true where role = 'admin' and is_admin = false;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and (is_admin = true or role = 'admin')
  );
$$;

create table if not exists public.admin_platform_emails (
  id uuid primary key default gen_random_uuid(),
  sent_by uuid references auth.users (id) on delete set null,
  recipient_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.admin_platform_emails enable row level security;

create policy "Admins manage platform emails" on public.admin_platform_emails
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins read all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins update all profiles" on public.profiles
  for update using (public.is_admin());

create policy "Admins read all matches" on public.matches
  for select using (public.is_admin());

create or replace function public.admin_platform_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'totalUsers', (select count(*) from public.profiles),
    'suspendedUsers', (select count(*) from public.profiles where account_suspended = true),
    'totalClubs', (select count(*) from public.clubs),
    'verifiedClubs', (select count(*) from public.clubs where verification_status = 'approved'),
    'pendingVerifications', (select count(*) from public.clubs where verification_status = 'pending'),
    'totalMatches', (select count(*) from public.matches),
    'publishedReports', (select count(*) from public.matches where report_published = true),
    'liveMatches', (select count(*) from public.matches where status in ('live', 'half_time', 'extra_time', 'penalties')),
    'planFree', (select count(*) from public.profiles where subscription_plan = 'free'),
    'planClub', (select count(*) from public.profiles where subscription_plan in ('club', 'basic')),
    'planCounty', (select count(*) from public.profiles where subscription_plan in ('county', 'premium')),
    'planMedia', (select count(*) from public.profiles where subscription_plan in ('presspass', 'media')),
    'trialing', (select count(*) from public.profiles where subscription_status = 'trialing'),
    'activePaid', (select count(*) from public.profiles where subscription_status = 'active' and subscription_plan not in ('free'))
  );
end;
$$;

create or replace function public.admin_list_users()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(u) order by u.created_at desc)
    from (
      select
        p.id,
        p.email,
        p.profile_type,
        p.primary_sport,
        p.subscription_plan,
        p.subscription_status,
        p.is_admin,
        p.account_suspended,
        p.role,
        p.created_at,
        (select count(*) from public.matches m where m.user_id = p.id) as match_count,
        (select c.name from public.clubs c where c.user_id = p.id order by c.created_at asc limit 1) as club_name
      from public.profiles p
    ) u
  ), '[]'::jsonb);
end;
$$;

create or replace function public.admin_list_clubs()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(c) order by c.created_at desc)
    from (
      select
        cl.id,
        cl.user_id,
        cl.name,
        cl.county,
        cl.verification_status,
        cl.verification_method,
        cl.verified_at,
        cl.contact_email,
        cl.contact_phone,
        cl.ground,
        cl.website,
        cl.created_at,
        p.email as owner_email,
        p.subscription_plan as owner_plan
      from public.clubs cl
      left join public.profiles p on p.id = cl.user_id
    ) c
  ), '[]'::jsonb);
end;
$$;

create or replace function public.admin_list_published_reports()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(r) order by r.updated_at desc)
    from (
      select
        m.id,
        m.public_id,
        m.home_team_name,
        m.away_team_name,
        m.sport,
        m.status,
        m.report_published,
        m.match_date,
        m.updated_at,
        p.email as publisher_email,
        c.name as club_name
      from public.matches m
      left join public.profiles p on p.id = m.user_id
      left join public.clubs c on c.id = m.club_id
      where m.report_published = true or (m.public_id is not null and m.public_id <> '')
      limit 200
    ) r
  ), '[]'::jsonb);
end;
$$;

create or replace function public.admin_set_user_subscription(
  p_user_id uuid,
  p_plan text,
  p_status text default 'active'
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  prof public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  update public.profiles
  set subscription_plan = p_plan, subscription_status = p_status, updated_at = now()
  where id = p_user_id
  returning * into prof;

  if prof.id is null then
    raise exception 'User not found';
  end if;

  return prof;
end;
$$;

create or replace function public.admin_suspend_user(p_user_id uuid, p_suspended boolean)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  prof public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'You cannot suspend your own account';
  end if;

  update public.profiles
  set account_suspended = p_suspended, updated_at = now()
  where id = p_user_id
  returning * into prof;

  if prof.id is null then
    raise exception 'User not found';
  end if;

  return prof;
end;
$$;

create or replace function public.admin_send_platform_email(
  p_recipient text,
  p_subject text,
  p_body text
)
returns public.admin_platform_emails
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.admin_platform_emails;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  insert into public.admin_platform_emails (sent_by, recipient_email, subject, body, status)
  values (auth.uid(), trim(p_recipient), trim(p_subject), trim(p_body), 'queued')
  returning * into row;

  return row;
end;
$$;

grant execute on function public.admin_platform_analytics() to authenticated;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_list_clubs() to authenticated;
grant execute on function public.admin_list_published_reports() to authenticated;
grant execute on function public.admin_set_user_subscription(uuid, text, text) to authenticated;
grant execute on function public.admin_suspend_user(uuid, boolean) to authenticated;
grant execute on function public.admin_send_platform_email(text, text, text) to authenticated;


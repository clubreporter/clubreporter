-- Grant full platform admin to Brian Carey
-- 1) Sign up / log in at clubreporter.ie with briandavidcarey@gmail.com
-- 2) Run this script in Supabase SQL Editor

update public.profiles
set
  is_admin = true,
  role = 'admin',
  profile_type = 'club',
  primary_sport = 'gaa',
  subscription_plan = 'county',
  subscription_status = 'active',
  account_suspended = false,
  email = 'briandavidcarey@gmail.com'
where id = (
  select id from auth.users where lower(email) = lower('briandavidcarey@gmail.com') limit 1
);

-- Demo club for testing club flows (optional)
insert into public.clubs (user_id, name, county, verification_status)
select
  u.id,
  'Carey GAA Club',
  'Dublin',
  'approved'
from auth.users u
where lower(u.email) = lower('briandavidcarey@gmail.com')
  and not exists (select 1 from public.clubs c where c.user_id = u.id);

-- If no row updated, the auth user does not exist yet — sign up first, then re-run.

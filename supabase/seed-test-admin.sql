-- ClubReporter test admin account
-- 1) Sign up at /signup with test@test.com / 123456 (confirm email if required)
-- 2) Run this entire script in Supabase SQL Editor

update public.profiles
set
  is_admin = true,
  role = 'admin',
  profile_type = 'club',
  primary_sport = 'gaa',
  subscription_plan = 'county',
  subscription_status = 'active',
  account_suspended = false,
  email = 'test@test.com'
where id = (
  select id from auth.users where lower(email) = lower('test@test.com') limit 1
);

-- Optional: ensure a demo club exists for verification UI
insert into public.clubs (user_id, name, county, verification_status)
select
  u.id,
  'Test GAA Club',
  'Dublin',
  'unverified'
from auth.users u
where lower(u.email) = lower('test@test.com')
  and not exists (select 1 from public.clubs c where c.user_id = u.id);

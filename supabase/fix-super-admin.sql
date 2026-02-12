-- Run this in Supabase Dashboard → SQL Editor → New query. Then click "Run".
-- This makes ashleymash013@gmail.com a super admin by ensuring a profile row with platform_role = 'super_admin'.

-- Your auth user id (from the session you shared):
-- 05fcc6af-079a-4f2b-b88f-3046d9f6837f

-- Step 1: Insert profile from auth.users if it doesn't exist, then set super_admin.
-- (Uses your user id directly so it works even if email matching is fussy.)
insert into public.profiles (user_id, email, full_name, phone, platform_role)
select
  u.id,
  u.email,
  coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), 'Super admin'),
  '073 153 1188',
  'super_admin'
from auth.users u
where u.id = '05fcc6af-079a-4f2b-b88f-3046d9f6837f'
   or lower(trim(u.email)) = 'ashleymash013@gmail.com'
limit 1
on conflict (user_id) do update set
  platform_role = 'super_admin',
  email = coalesce(excluded.email, public.profiles.email),
  full_name = coalesce(nullif(trim(excluded.full_name), ''), public.profiles.full_name),
  phone = coalesce(nullif(trim(excluded.phone), ''), public.profiles.phone);

-- Step 2: If no row was found in auth.users (e.g. wrong project), insert by user id and email anyway.
-- This row will only succeed if the user_id exists in auth.users (FK).
insert into public.profiles (user_id, email, full_name, phone, platform_role)
values (
  '05fcc6af-079a-4f2b-b88f-3046d9f6837f',
  'ashleymash013@gmail.com',
  'Super admin',
  '073 153 1188',
  'super_admin'
)
on conflict (user_id) do update set
  platform_role = 'super_admin',
  email = excluded.email,
  full_name = coalesce(nullif(trim(excluded.full_name), ''), public.profiles.full_name),
  phone = coalesce(nullif(trim(excluded.phone), ''), public.profiles.phone);

-- Step 3: Force super_admin and display name / phone for your email no matter what.
update public.profiles
set platform_role = 'super_admin',
    email = 'ashleymash013@gmail.com',
    full_name = 'Super admin',
    phone = '073 153 1188'
where user_id = '05fcc6af-079a-4f2b-b88f-3046d9f6837f'
   or lower(trim(email)) = 'ashleymash013@gmail.com';

-- Verify: run this to confirm your profile (should show platform_role = super_admin, full_name, phone).
-- select user_id, email, full_name, phone, platform_role from public.profiles where email = 'ashleymash013@gmail.com' or user_id = '05fcc6af-079a-4f2b-b88f-3046d9f6837f';

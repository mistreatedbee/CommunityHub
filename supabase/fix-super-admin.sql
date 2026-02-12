-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) for project radiorvcndflygzicbte
-- if you still can't log in or don't get super admin access.
--
-- 1. Ensures your Auth user has a profile (creates one if missing).
-- 2. Sets that user as super_admin.
--
-- If "0 rows" or no row from auth.users: add the user first in
-- Authentication → Users → Add user (email: ashleymash013@gmail.com, set password, check Auto Confirm User).

insert into public.profiles (user_id, email, full_name, platform_role)
select id, email, coalesce(raw_user_meta_data->>'full_name', ''), 'super_admin'
from auth.users
where email = 'ashleymash013@gmail.com'
on conflict (user_id) do update set
  platform_role = 'super_admin',
  email = excluded.email;

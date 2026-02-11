-- Make the first user ever get super_admin role so you can log in as super admin.
-- For existing users: run in Supabase SQL Editor (as service role or postgres):
--   update public.profiles set platform_role = 'super_admin' where email = 'your@email.com';

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, full_name, platform_role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  on conflict (user_id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);

  -- If this is the only profile (first user ever), make them super_admin
  if (select count(*) from public.profiles) = 1 then
    update public.profiles set platform_role = 'super_admin' where user_id = new.id;
  end if;

  return new;
end;
$$;

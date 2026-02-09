create extension if not exists pgcrypto;

create type public.platform_role as enum ('user', 'super_admin');
create type public.org_role as enum ('owner', 'admin', 'supervisor', 'employee', 'member');
create type public.membership_status as enum ('active', 'inactive', 'pending');
create type public.org_status as enum ('pending', 'active', 'suspended');
create type public.license_status as enum ('trial', 'active', 'expired', 'cancelled');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.org_status not null default 'pending',
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  platform_role public.platform_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  max_admins int not null check (max_admins >= 0),
  max_supervisors int not null check (max_supervisors >= 0),
  max_employees int not null check (max_employees >= 0),
  max_members int not null check (max_members >= 0),
  feature_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  license_id uuid not null references public.licenses(id),
  status public.license_status not null default 'trial',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  unique (organization_id)
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.org_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  starts_on date,
  ends_on date,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  title text not null,
  description text,
  schema jsonb not null,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  form_id uuid not null references public.forms(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  status text not null default 'submitted',
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;


drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_orgs_updated_at on public.organizations;
create trigger trg_orgs_updated_at before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists trg_memberships_updated_at on public.organization_memberships;
create trigger trg_memberships_updated_at before update on public.organization_memberships
for each row execute function public.set_updated_at();

drop trigger if exists trg_programs_updated_at on public.programs;
create trigger trg_programs_updated_at before update on public.programs
for each row execute function public.set_updated_at();

drop trigger if exists trg_forms_updated_at on public.forms;
create trigger trg_forms_updated_at before update on public.forms
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.is_platform_super_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.platform_role = 'super_admin'
  );
$$;

create or replace function public.current_user_org_ids()
returns setof uuid language sql stable as $$
  select m.organization_id
  from public.organization_memberships m
  where m.user_id = auth.uid() and m.status = 'active';
$$;

create or replace function public.enforce_license_limits()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  selected_license record;
  active_count int;
begin
  if new.status <> 'active' then return new; end if;

  select l.max_admins, l.max_supervisors, l.max_employees, l.max_members
  into selected_license
  from public.organization_licenses ol
  join public.licenses l on l.id = ol.license_id
  where ol.organization_id = new.organization_id
    and ol.status in ('trial', 'active')
  limit 1;

  if selected_license is null then
    raise exception 'No active license for organization %', new.organization_id;
  end if;

  select count(*) into active_count
  from public.organization_memberships m
  where m.organization_id = new.organization_id
    and m.status = 'active'
    and m.role = new.role
    and (tg_op <> 'UPDATE' or m.id <> new.id);

  if new.role = 'admin' and active_count >= selected_license.max_admins then
    raise exception 'Admin seat limit reached for organization';
  elsif new.role = 'supervisor' and active_count >= selected_license.max_supervisors then
    raise exception 'Supervisor seat limit reached for organization';
  elsif new.role = 'employee' and active_count >= selected_license.max_employees then
    raise exception 'Employee seat limit reached for organization';
  elsif new.role = 'member' and active_count >= selected_license.max_members then
    raise exception 'Member seat limit reached for organization';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_license_limits on public.organization_memberships;
create trigger trg_enforce_license_limits
before insert or update on public.organization_memberships
for each row execute function public.enforce_license_limits();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.organization_licenses enable row level security;
alter table public.programs enable row level security;
alter table public.forms enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.licenses enable row level security;

create policy super_admin_orgs_all on public.organizations
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

create policy orgs_member_select on public.organizations
for select using (id in (select public.current_user_org_ids()));

create policy profiles_self_select on public.profiles
for select using (user_id = auth.uid() or public.is_platform_super_admin());

create policy profiles_self_update on public.profiles
for update using (user_id = auth.uid() or public.is_platform_super_admin())
with check (user_id = auth.uid() or public.is_platform_super_admin());

create policy memberships_org_select on public.organization_memberships
for select using (
  organization_id in (select public.current_user_org_ids())
  or user_id = auth.uid()
  or public.is_platform_super_admin()
);

create policy org_tables_rw_programs on public.programs
for all using (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin())
with check (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin());

create policy org_tables_rw_forms on public.forms
for all using (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin())
with check (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin());

create policy org_tables_rw_submissions on public.submissions
for all using (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin())
with check (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin());

create policy notifications_user_select on public.notifications
for select using (user_id = auth.uid() or public.is_platform_super_admin());

create policy notifications_user_update on public.notifications
for update using (user_id = auth.uid() or public.is_platform_super_admin())
with check (user_id = auth.uid() or public.is_platform_super_admin());

create policy audit_logs_org_select on public.audit_logs
for select using (organization_id in (select public.current_user_org_ids()) or public.is_platform_super_admin());

create policy licenses_read_authenticated on public.licenses
for select to authenticated using (true);

insert into public.licenses (code, name, max_admins, max_supervisors, max_employees, max_members, feature_flags)
values
  ('starter', 'Starter', 2, 5, 25, 1000, '{"analytics": false, "exports": false}'::jsonb),
  ('pro', 'Pro', 5, 20, 150, 10000, '{"analytics": true, "exports": true}'::jsonb),
  ('enterprise', 'Enterprise', 25, 100, 1000, 50000, '{"analytics": true, "exports": true, "priority_support": true}'::jsonb)
on conflict (code) do nothing;

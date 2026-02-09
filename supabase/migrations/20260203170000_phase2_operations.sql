create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  applicant_name text not null,
  applicant_email text not null,
  phone text,
  occupation text,
  company text,
  interests text[] not null default '{}',
  reason text,
  linkedin text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'info_requested')),
  admin_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applications_org_status_created
  on public.applications (organization_id, status, created_at desc);

alter table public.applications enable row level security;

create or replace function public.user_has_org_role(org_id uuid, roles public.org_role[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = any(roles)
  );
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
drop policy if exists profiles_self_select on public.profiles;
drop policy if exists profiles_select_scoped on public.profiles;
create policy profiles_select_scoped on public.profiles
for select
using (
  user_id = auth.uid()
  or public.is_platform_super_admin()
  or exists (
    select 1
    from public.organization_memberships target
    join public.organization_memberships actor
      on actor.organization_id = target.organization_id
    where target.user_id = profiles.user_id
      and actor.user_id = auth.uid()
      and actor.status = 'active'
      and actor.role in ('owner', 'admin', 'supervisor')
  )
);

drop policy if exists profiles_self_update on public.profiles;
drop policy if exists profiles_update_self_only on public.profiles;
create policy profiles_update_self_only on public.profiles
for update
using (user_id = auth.uid() or public.is_platform_super_admin())
with check (user_id = auth.uid() or public.is_platform_super_admin());

drop policy if exists applications_super_admin_all on public.applications;
create policy applications_super_admin_all on public.applications
for all
using (public.is_platform_super_admin())
with check (public.is_platform_super_admin());

drop policy if exists applications_org_staff_select on public.applications;
create policy applications_org_staff_select on public.applications
for select
to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role, 'supervisor'::public.org_role]
  )
  or user_id = auth.uid()
);

drop policy if exists applications_org_staff_update on public.applications;
create policy applications_org_staff_update on public.applications
for update
to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role, 'supervisor'::public.org_role]
  )
)
with check (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role, 'supervisor'::public.org_role]
  )
);

drop policy if exists applications_org_staff_delete on public.applications;
create policy applications_org_staff_delete on public.applications
for delete
to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role]
  )
);

drop policy if exists applications_public_insert on public.applications;
create policy applications_public_insert on public.applications
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.organizations o
    where o.id = organization_id
      and o.status in ('active', 'pending')
  )
);
create table if not exists public.submission_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  form_id uuid references public.forms(id) on delete cascade,
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  assigned_to uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed', 'flagged')),
  note text,
  assigned_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_submission_assignments_org_assignee
  on public.submission_assignments (organization_id, assigned_to, status);

alter table public.submission_assignments enable row level security;

drop trigger if exists trg_submission_assignments_updated_at on public.submission_assignments;
create trigger trg_submission_assignments_updated_at
before update on public.submission_assignments
for each row execute function public.set_updated_at();

drop policy if exists submission_assignments_super_admin_all on public.submission_assignments;
create policy submission_assignments_super_admin_all on public.submission_assignments
for all
using (public.is_platform_super_admin())
with check (public.is_platform_super_admin());

drop policy if exists submission_assignments_staff_select on public.submission_assignments;
create policy submission_assignments_staff_select on public.submission_assignments
for select
to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role, 'supervisor'::public.org_role]
  )
  or assigned_to = auth.uid()
);

drop policy if exists submission_assignments_admin_manage on public.submission_assignments;
create policy submission_assignments_admin_manage on public.submission_assignments
for all
to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role]
  )
)
with check (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role]
  )
);

drop policy if exists submission_assignments_supervisor_update_own on public.submission_assignments;
create policy submission_assignments_supervisor_update_own on public.submission_assignments
for update
to authenticated
using (assigned_to = auth.uid())
with check (assigned_to = auth.uid());

alter table public.resource_folders enable row level security;
alter table public.session_rsvps enable row level security;
alter table public.program_modules enable row level security;
alter table public.program_assignments enable row level security;
alter table public.program_enrollments enable row level security;

drop policy if exists resource_folders_super_admin_all on public.resource_folders;
create policy resource_folders_super_admin_all on public.resource_folders
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists resource_folders_org_manage on public.resource_folders;
create policy resource_folders_org_manage on public.resource_folders
for all to authenticated
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

drop policy if exists resource_folders_org_select on public.resource_folders;
create policy resource_folders_org_select on public.resource_folders
for select to authenticated
using (organization_id in (select public.current_user_org_ids()));

drop policy if exists session_rsvps_super_admin_all on public.session_rsvps;
create policy session_rsvps_super_admin_all on public.session_rsvps
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists session_rsvps_member_select on public.session_rsvps;
create policy session_rsvps_member_select on public.session_rsvps
for select to authenticated
using (session_id in (select id from public.sessions where organization_id in (select public.current_user_org_ids())));

drop policy if exists session_rsvps_self_manage on public.session_rsvps;
create policy session_rsvps_self_manage on public.session_rsvps
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists program_modules_super_admin_all on public.program_modules;
create policy program_modules_super_admin_all on public.program_modules
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists program_modules_org_manage on public.program_modules;
create policy program_modules_org_manage on public.program_modules
for all to authenticated
using (
  program_id in (select id from public.programs where organization_id in (select public.current_user_org_ids()))
)
with check (
  program_id in (select id from public.programs where organization_id in (select public.current_user_org_ids()))
);

drop policy if exists program_assignments_super_admin_all on public.program_assignments;
create policy program_assignments_super_admin_all on public.program_assignments
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists program_assignments_org_manage on public.program_assignments;
create policy program_assignments_org_manage on public.program_assignments
for all to authenticated
using (
  program_id in (select id from public.programs where organization_id in (select public.current_user_org_ids()))
)
with check (
  program_id in (select id from public.programs where organization_id in (select public.current_user_org_ids()))
);

drop policy if exists program_enrollments_super_admin_all on public.program_enrollments;
create policy program_enrollments_super_admin_all on public.program_enrollments
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists program_enrollments_org_select on public.program_enrollments;
create policy program_enrollments_org_select on public.program_enrollments
for select to authenticated
using (
  program_id in (select id from public.programs where organization_id in (select public.current_user_org_ids()))
);

drop policy if exists program_enrollments_self_manage on public.program_enrollments;
create policy program_enrollments_self_manage on public.program_enrollments
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

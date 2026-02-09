drop policy if exists org_licenses_super_admin_all on public.organization_licenses;
create policy org_licenses_super_admin_all on public.organization_licenses
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists org_licenses_org_select on public.organization_licenses;
create policy org_licenses_org_select on public.organization_licenses
for select to authenticated
using (organization_id in (select public.current_user_org_ids()));

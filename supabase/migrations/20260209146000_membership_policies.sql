drop policy if exists memberships_super_admin_all on public.organization_memberships;
create policy memberships_super_admin_all on public.organization_memberships
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists memberships_org_manage on public.organization_memberships;
create policy memberships_org_manage on public.organization_memberships
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

drop policy if exists memberships_self_insert on public.organization_memberships;
create policy memberships_self_insert on public.organization_memberships
for insert to authenticated
with check (
  user_id = auth.uid()
  and organization_id in (select id from public.organizations where status = 'active')
);

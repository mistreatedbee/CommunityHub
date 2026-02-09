drop policy if exists tenant_posts_member_rw on public.tenant_posts;

create policy tenant_posts_member_select on public.tenant_posts
for select to authenticated
using (organization_id in (select public.current_user_org_ids()));

create policy tenant_posts_staff_manage on public.tenant_posts
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

drop policy if exists tenant_resources_member_rw on public.tenant_resources;

create policy tenant_resources_member_select on public.tenant_resources
for select to authenticated
using (organization_id in (select public.current_user_org_ids()));

create policy tenant_resources_staff_manage on public.tenant_resources
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

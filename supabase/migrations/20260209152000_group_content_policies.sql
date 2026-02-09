drop policy if exists tenant_posts_member_select on public.tenant_posts;
create policy tenant_posts_member_select on public.tenant_posts
for select to authenticated
using (
  organization_id in (select public.current_user_org_ids())
  and (
    group_id is null
    or exists (
      select 1
      from public.group_memberships gm
      where gm.group_id = group_id
        and gm.user_id = auth.uid()
        and gm.status = 'active'
    )
  )
);

drop policy if exists tenant_resources_member_select on public.tenant_resources;
create policy tenant_resources_member_select on public.tenant_resources
for select to authenticated
using (
  organization_id in (select public.current_user_org_ids())
  and (
    group_id is null
    or exists (
      select 1
      from public.group_memberships gm
      where gm.group_id = group_id
        and gm.user_id = auth.uid()
        and gm.status = 'active'
    )
  )
);

drop policy if exists group_memberships_insert_self on public.group_memberships;
create policy group_memberships_insert_self on public.group_memberships
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.groups g
    where g.id = group_id
      and g.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists thread_members_insert on public.direct_thread_members;
create policy thread_members_insert on public.direct_thread_members
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.direct_threads t
    where t.id = thread_id
      and t.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists direct_messages_insert on public.direct_messages;
create policy direct_messages_insert on public.direct_messages
for insert to authenticated
with check (
  sender_user_id = auth.uid()
  and exists (
    select 1
    from public.direct_thread_members m
    where m.thread_id = direct_messages.thread_id
      and m.user_id = auth.uid()
  )
);

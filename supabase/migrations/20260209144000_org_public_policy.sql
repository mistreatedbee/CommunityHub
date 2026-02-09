drop policy if exists organizations_public_select on public.organizations;
create policy organizations_public_select on public.organizations
for select to anon, authenticated
using (status in ('active', 'pending') and is_public = true);

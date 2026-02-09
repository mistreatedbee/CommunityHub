drop policy if exists super_admin_all_tenant_settings on public.tenant_settings;
create policy super_admin_all_tenant_settings on public.tenant_settings
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists super_admin_all_registration_fields on public.registration_fields;
create policy super_admin_all_registration_fields on public.registration_fields
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists super_admin_all_registration_submissions on public.registration_submissions;
create policy super_admin_all_registration_submissions on public.registration_submissions
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists super_admin_all_tenant_posts on public.tenant_posts;
create policy super_admin_all_tenant_posts on public.tenant_posts
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists super_admin_all_tenant_resources on public.tenant_resources;
create policy super_admin_all_tenant_resources on public.tenant_resources
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

drop policy if exists super_admin_all_invitations on public.invitations;
create policy super_admin_all_invitations on public.invitations
for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

-- Seed data for local/demo environments only.
-- Insert demo tenants and settings. Do NOT run in production.

insert into public.organizations (name, slug, status, is_public, description, category, location)
values
  ('Demo Community', 'demo-community', 'active', true, 'Sample community for demos.', 'Tech', 'Remote')
on conflict (slug) do nothing;

insert into public.tenant_settings (organization_id, public_signup, approval_required, registration_fields_enabled)
select id, true, false, true
from public.organizations
where slug = 'demo-community'
on conflict (organization_id) do nothing;

alter table public.organizations
  add column if not exists is_public boolean not null default true,
  add column if not exists category text,
  add column if not exists location text,
  add column if not exists logo_url text,
  add column if not exists approvals_required boolean not null default false;

alter table public.licenses
  add column if not exists price_cents int not null default 0,
  add column if not exists billing_cycle text not null default 'monthly',
  add column if not exists max_storage_mb int not null default 0,
  add column if not exists max_posts int not null default 0,
  add column if not exists max_resources int not null default 0;

alter table public.organization_licenses
  add column if not exists limits_snapshot jsonb not null default '{}'::jsonb;

create table if not exists public.tenant_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  public_signup boolean not null default true,
  approval_required boolean not null default false,
  registration_fields_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registration_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  label text not null,
  field_type text not null check (field_type in ('text','textarea','select','checkbox','radio','date','email','phone')),
  required boolean not null default false,
  options text[] not null default '{}'::text[],
  field_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.registration_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  content text not null,
  visibility text not null default 'members' check (visibility in ('public','members','leaders')),
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  file_url text not null,
  access_level text not null default 'members' check (access_level in ('public','members','leaders')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.org_role not null default 'member',
  token text not null unique,
  expires_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','accepted','expired','revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_registration_fields_org_order on public.registration_fields (organization_id, field_order);
create index if not exists idx_registration_submissions_org on public.registration_submissions (organization_id, created_at desc);
create index if not exists idx_tenant_posts_org_published on public.tenant_posts (organization_id, published_at desc);
create index if not exists idx_tenant_resources_org on public.tenant_resources (organization_id, created_at desc);
create index if not exists idx_invitations_org_status on public.invitations (organization_id, status);

drop trigger if exists trg_tenant_settings_updated_at on public.tenant_settings;
create trigger trg_tenant_settings_updated_at before update on public.tenant_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_tenant_posts_updated_at on public.tenant_posts;
create trigger trg_tenant_posts_updated_at before update on public.tenant_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_tenant_resources_updated_at on public.tenant_resources;
create trigger trg_tenant_resources_updated_at before update on public.tenant_resources
for each row execute function public.set_updated_at();

alter table public.tenant_settings enable row level security;
alter table public.registration_fields enable row level security;
alter table public.registration_submissions enable row level security;
alter table public.tenant_posts enable row level security;
alter table public.tenant_resources enable row level security;
alter table public.invitations enable row level security;

drop policy if exists tenant_settings_public_select on public.tenant_settings;
create policy tenant_settings_public_select on public.tenant_settings
for select to anon, authenticated
using (
  organization_id in (select id from public.organizations where is_public and status = 'active')
);

drop policy if exists tenant_settings_member_rw on public.tenant_settings;
create policy tenant_settings_member_rw on public.tenant_settings
for all to authenticated
using (
  organization_id in (select public.current_user_org_ids())
)
with check (
  organization_id in (select public.current_user_org_ids())
);

drop policy if exists registration_fields_public_select on public.registration_fields;
create policy registration_fields_public_select on public.registration_fields
for select to anon, authenticated
using (
  is_active
  and organization_id in (select id from public.organizations where is_public and status = 'active')
);

drop policy if exists registration_fields_org_rw on public.registration_fields;
create policy registration_fields_org_rw on public.registration_fields
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

drop policy if exists registration_submissions_member_insert on public.registration_submissions;
create policy registration_submissions_member_insert on public.registration_submissions
for insert to authenticated
with check (
  user_id = auth.uid()
  and organization_id in (select id from public.organizations where status = 'active')
);

drop policy if exists registration_submissions_org_select on public.registration_submissions;
create policy registration_submissions_org_select on public.registration_submissions
for select to authenticated
using (
  public.user_has_org_role(
    organization_id,
    array['owner'::public.org_role, 'admin'::public.org_role, 'supervisor'::public.org_role]
  )
);

drop policy if exists tenant_posts_public_read on public.tenant_posts;
create policy tenant_posts_public_read on public.tenant_posts
for select to anon, authenticated
using (
  is_published
  and visibility = 'public'
  and organization_id in (select id from public.organizations where is_public and status = 'active')
);

drop policy if exists tenant_posts_member_rw on public.tenant_posts;
create policy tenant_posts_member_rw on public.tenant_posts
for all to authenticated
using (
  organization_id in (select public.current_user_org_ids())
)
with check (
  organization_id in (select public.current_user_org_ids())
);

drop policy if exists tenant_resources_public_read on public.tenant_resources;
create policy tenant_resources_public_read on public.tenant_resources
for select to anon, authenticated
using (
  access_level = 'public'
  and organization_id in (select id from public.organizations where is_public and status = 'active')
);

drop policy if exists tenant_resources_member_rw on public.tenant_resources;
create policy tenant_resources_member_rw on public.tenant_resources
for all to authenticated
using (
  organization_id in (select public.current_user_org_ids())
)
with check (
  organization_id in (select public.current_user_org_ids())
);

drop policy if exists invitations_staff_rw on public.invitations;
create policy invitations_staff_rw on public.invitations
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

insert into public.licenses (code, name, max_admins, max_supervisors, max_employees, max_members, max_storage_mb, max_posts, max_resources, price_cents, billing_cycle, feature_flags)
values
  ('personal', 'Personal', 1, 1, 5, 200, 1024, 200, 50, 9900, 'monthly', '{"analytics": false, "approvals": false, "staff_roles": false, "custom_domain": false}'::jsonb),
  ('business', 'Business', 5, 10, 50, 2000, 10240, 2000, 500, 49900, 'monthly', '{"analytics": true, "approvals": true, "staff_roles": true, "custom_domain": false}'::jsonb),
  ('enterprise', 'Enterprise', 25, 100, 1000, 50000, 102400, 20000, 5000, 199900, 'monthly', '{"analytics": true, "approvals": true, "staff_roles": true, "custom_domain": true}'::jsonb)
on conflict (code) do nothing;

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  platform_name text not null default 'CommunityHub',
  support_email text,
  terms_url text,
  privacy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

drop policy if exists platform_settings_super_admin_rw on public.platform_settings;
create policy platform_settings_super_admin_rw on public.platform_settings
for all
using (public.is_platform_super_admin())
with check (public.is_platform_super_admin());

drop trigger if exists trg_platform_settings_updated_at on public.platform_settings;
create trigger trg_platform_settings_updated_at before update on public.platform_settings
for each row execute function public.set_updated_at();

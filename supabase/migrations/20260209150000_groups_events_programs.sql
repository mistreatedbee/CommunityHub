alter table public.tenant_posts
  add column if not exists group_id uuid references public.groups(id) on delete set null;

alter table public.tenant_resources
  add column if not exists group_id uuid references public.groups(id) on delete set null;

create table if not exists public.resource_folders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  parent_id uuid references public.resource_folders(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenant_resources
  add column if not exists folder_id uuid references public.resource_folders(id) on delete set null;

create table if not exists public.session_rsvps (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'going' check (status in ('going','maybe','not_going')),
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.program_modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  description text,
  content text,
  module_order int not null default 0,
  resource_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.program_assignments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  group_id uuid references public.groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (program_id, group_id, user_id)
);

create table if not exists public.program_enrollments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','withdrawn')),
  created_at timestamptz not null default now(),
  unique (program_id, user_id)
);

create index if not exists idx_resource_folders_org on public.resource_folders (organization_id);
create index if not exists idx_resources_folder on public.tenant_resources (folder_id);
create index if not exists idx_session_rsvps_session on public.session_rsvps (session_id);
create index if not exists idx_program_modules_program on public.program_modules (program_id, module_order);
create index if not exists idx_program_assignments_program on public.program_assignments (program_id);
create index if not exists idx_program_enrollments_program on public.program_enrollments (program_id);

drop trigger if exists trg_resource_folders_updated_at on public.resource_folders;
create trigger trg_resource_folders_updated_at before update on public.resource_folders
for each row execute function public.set_updated_at();

drop trigger if exists trg_program_modules_updated_at on public.program_modules;
create trigger trg_program_modules_updated_at before update on public.program_modules
for each row execute function public.set_updated_at();

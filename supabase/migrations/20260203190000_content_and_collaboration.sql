create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'general',
  visibility text not null default 'public' check (visibility in ('public','members','leaders')),
  is_pinned boolean not null default false,
  author_user_id uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null default 'general',
  image_url text,
  author_user_id uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  image_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','moderator','owner')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  title text not null,
  content text not null,
  author_user_id uuid references auth.users(id) on delete set null,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discussion_posts (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  location text,
  meeting_link text,
  host_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.direct_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.direct_thread_members (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.direct_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.direct_threads(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_announcements_org_published on public.announcements (organization_id, published_at desc);
create index if not exists idx_news_org_published on public.news_articles (organization_id, published_at desc);
create index if not exists idx_groups_org on public.groups (organization_id);
create index if not exists idx_discussions_org on public.discussions (organization_id, created_at desc);
create index if not exists idx_sessions_org_date on public.sessions (organization_id, scheduled_at desc);

-- updated_at triggers

-- explicit trigger creation for portability
drop trigger if exists trg_announcements_updated_at on public.announcements;
create trigger trg_announcements_updated_at before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists trg_news_articles_updated_at on public.news_articles;
create trigger trg_news_articles_updated_at before update on public.news_articles
for each row execute function public.set_updated_at();

drop trigger if exists trg_groups_updated_at on public.groups;
create trigger trg_groups_updated_at before update on public.groups
for each row execute function public.set_updated_at();

drop trigger if exists trg_discussions_updated_at on public.discussions;
create trigger trg_discussions_updated_at before update on public.discussions
for each row execute function public.set_updated_at();

drop trigger if exists trg_discussion_posts_updated_at on public.discussion_posts;
create trigger trg_discussion_posts_updated_at before update on public.discussion_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_sessions_updated_at on public.sessions;
create trigger trg_sessions_updated_at before update on public.sessions
for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;
alter table public.news_articles enable row level security;
alter table public.groups enable row level security;
alter table public.group_memberships enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_posts enable row level security;
alter table public.sessions enable row level security;
alter table public.direct_threads enable row level security;
alter table public.direct_thread_members enable row level security;
alter table public.direct_messages enable row level security;

-- super admin access
drop policy if exists super_admin_all_announcements on public.announcements;
create policy super_admin_all_announcements on public.announcements for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_news on public.news_articles;
create policy super_admin_all_news on public.news_articles for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_groups on public.groups;
create policy super_admin_all_groups on public.groups for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_group_memberships on public.group_memberships;
create policy super_admin_all_group_memberships on public.group_memberships for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_discussions on public.discussions;
create policy super_admin_all_discussions on public.discussions for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_discussion_posts on public.discussion_posts;
create policy super_admin_all_discussion_posts on public.discussion_posts for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_sessions on public.sessions;
create policy super_admin_all_sessions on public.sessions for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_threads on public.direct_threads;
create policy super_admin_all_threads on public.direct_threads for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_thread_members on public.direct_thread_members;
create policy super_admin_all_thread_members on public.direct_thread_members for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());
drop policy if exists super_admin_all_messages on public.direct_messages;
create policy super_admin_all_messages on public.direct_messages for all using (public.is_platform_super_admin()) with check (public.is_platform_super_admin());

-- public read for public content
drop policy if exists announcements_public_read on public.announcements;
create policy announcements_public_read on public.announcements
for select using (visibility = 'public');

drop policy if exists news_public_read on public.news_articles;
create policy news_public_read on public.news_articles
for select using (true);

-- org scoped staff/member access
drop policy if exists announcements_org_rw on public.announcements;
create policy announcements_org_rw on public.announcements
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists news_org_rw on public.news_articles;
create policy news_org_rw on public.news_articles
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists groups_org_rw on public.groups;
create policy groups_org_rw on public.groups
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists group_memberships_select on public.group_memberships;
create policy group_memberships_select on public.group_memberships
for select to authenticated
using (
  exists (
    select 1 from public.groups g
    where g.id = group_id
      and g.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists group_memberships_insert_self on public.group_memberships;
create policy group_memberships_insert_self on public.group_memberships
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists group_memberships_update_staff on public.group_memberships;
create policy group_memberships_update_staff on public.group_memberships
for update to authenticated
using (
  exists (
    select 1 from public.groups g
    where g.id = group_id
      and public.user_has_org_role(g.organization_id, array['owner'::public.org_role,'admin'::public.org_role,'supervisor'::public.org_role])
  )
)
with check (
  exists (
    select 1 from public.groups g
    where g.id = group_id
      and public.user_has_org_role(g.organization_id, array['owner'::public.org_role,'admin'::public.org_role,'supervisor'::public.org_role])
  )
);

drop policy if exists discussions_org_rw on public.discussions;
create policy discussions_org_rw on public.discussions
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists discussion_posts_select on public.discussion_posts;
create policy discussion_posts_select on public.discussion_posts
for select to authenticated
using (
  exists (
    select 1 from public.discussions d
    where d.id = discussion_id
      and d.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists discussion_posts_insert on public.discussion_posts;
create policy discussion_posts_insert on public.discussion_posts
for insert to authenticated
with check (
  author_user_id = auth.uid()
  and exists (
    select 1 from public.discussions d
    where d.id = discussion_id
      and d.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists sessions_org_rw on public.sessions;
create policy sessions_org_rw on public.sessions
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists threads_org_rw on public.direct_threads;
create policy threads_org_rw on public.direct_threads
for all to authenticated
using (organization_id in (select public.current_user_org_ids()))
with check (organization_id in (select public.current_user_org_ids()));

drop policy if exists thread_members_select on public.direct_thread_members;
create policy thread_members_select on public.direct_thread_members
for select to authenticated
using (
  exists (
    select 1 from public.direct_threads t
    where t.id = thread_id
      and t.organization_id in (select public.current_user_org_ids())
  )
);

drop policy if exists thread_members_insert on public.direct_thread_members;
create policy thread_members_insert on public.direct_thread_members
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists direct_messages_select on public.direct_messages;
create policy direct_messages_select on public.direct_messages
for select to authenticated
using (
  exists (
    select 1
    from public.direct_thread_members m
    where m.thread_id = direct_messages.thread_id
      and m.user_id = auth.uid()
  )
);

drop policy if exists direct_messages_insert on public.direct_messages;
create policy direct_messages_insert on public.direct_messages
for insert to authenticated
with check (sender_user_id = auth.uid());

-- public discovery policies for onboarding pages
drop policy if exists organizations_public_select on public.organizations;
create policy organizations_public_select on public.organizations
for select to anon, authenticated
using (status in ('active', 'pending'));

drop policy if exists sessions_public_select on public.sessions;
create policy sessions_public_select on public.sessions
for select to anon, authenticated
using (status = 'scheduled');

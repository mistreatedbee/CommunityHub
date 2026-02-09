do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'applications_applicant_email_len') then
    alter table public.applications
      add constraint applications_applicant_email_len check (char_length(applicant_email) <= 320);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_applicant_name_len') then
    alter table public.applications
      add constraint applications_applicant_name_len check (char_length(applicant_name) <= 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_phone_len') then
    alter table public.applications
      add constraint applications_phone_len check (phone is null or char_length(phone) <= 30);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_occupation_len') then
    alter table public.applications
      add constraint applications_occupation_len check (occupation is null or char_length(occupation) <= 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_company_len') then
    alter table public.applications
      add constraint applications_company_len check (company is null or char_length(company) <= 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_reason_len') then
    alter table public.applications
      add constraint applications_reason_len check (reason is null or char_length(reason) <= 2000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_linkedin_len') then
    alter table public.applications
      add constraint applications_linkedin_len check (linkedin is null or char_length(linkedin) <= 300);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'organizations_name_len') then
    alter table public.organizations
      add constraint organizations_name_len check (char_length(name) <= 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'organizations_slug_len') then
    alter table public.organizations
      add constraint organizations_slug_len check (char_length(slug) <= 120);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_full_name_len') then
    alter table public.profiles
      add constraint profiles_full_name_len check (full_name is null or char_length(full_name) <= 120);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'announcements_title_len') then
    alter table public.announcements
      add constraint announcements_title_len check (char_length(title) <= 200);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'announcements_content_len') then
    alter table public.announcements
      add constraint announcements_content_len check (char_length(content) <= 10000);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'news_articles_title_len') then
    alter table public.news_articles
      add constraint news_articles_title_len check (char_length(title) <= 200);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'news_articles_excerpt_len') then
    alter table public.news_articles
      add constraint news_articles_excerpt_len check (char_length(excerpt) <= 500);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'news_articles_content_len') then
    alter table public.news_articles
      add constraint news_articles_content_len check (char_length(content) <= 10000);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'discussions_title_len') then
    alter table public.discussions
      add constraint discussions_title_len check (char_length(title) <= 200);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'discussions_content_len') then
    alter table public.discussions
      add constraint discussions_content_len check (char_length(content) <= 10000);
  end if;
end $$;

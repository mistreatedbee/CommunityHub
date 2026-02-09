alter table public.audit_logs enable row level security;

drop policy if exists audit_logs_insert_authenticated on public.audit_logs;
create policy audit_logs_insert_authenticated on public.audit_logs
for insert to authenticated
with check (
  public.is_platform_super_admin()
  or organization_id in (select public.current_user_org_ids())
);

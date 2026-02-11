# CommunityHub

A professional community management platform for South African organizations.

## Getting Started

1. Run `npm install`
2. Run `npm run dev`

### Super Admin access

- **New install:** The first user who signs up is automatically given the `super_admin` role.
- **Existing user:** To promote your account to super admin, run in the Supabase SQL Editor (Dashboard → SQL Editor):

  ```sql
  update public.profiles set platform_role = 'super_admin' where email = 'your@email.com';
  ```

  Then log in again; you will be redirected to `/super-admin`.

## Architecture Overview

### Tenant Isolation
- Each tenant is represented by a row in `organizations` and all tenant data is scoped by `organization_id`.
- Supabase Row Level Security (RLS) enforces tenant isolation on every tenant-scoped table.
- Super admins bypass tenant RLS via `is_platform_super_admin()`.

### Routing
Path-based tenancy:
- Public directory: `/communities`
- Tenant public profile: `/c/:tenantSlug`
- Tenant join/register: `/c/:tenantSlug/join`
- Tenant member app: `/c/:tenantSlug/app`
- Tenant admin app: `/c/:tenantSlug/admin`
- Super admin console: `/super-admin`

### Permissions (RBAC)
Roles:
- `super_admin` (platform owner)
- `owner` / `admin` / `supervisor` (tenant admin/staff)
- `member` (tenant member)

Guards:
- `RequireSuperAdmin` protects platform routes.
- `RequireTenantRole` protects tenant admin and member routes.

### Licensing
Plans live in `licenses` with limits and feature flags. Tenants have `organization_licenses` for status and dates.
Plan limits are enforced in the UI and via database constraints/triggers where applicable.

## Completion Checklist

- [x] Multi-tenant data model with RLS isolation
- [x] Super admin dashboard + tenant management
- [x] License plan CRUD and assignment
- [x] Tenant admin onboarding wizard
- [x] Tenant member join flow with approval gating
- [x] Tenant admin content + resource management
- [x] Member feed, resources, notifications, profile
- [x] Groups, events, and programs modules
- [x] Announcements management and member view
- [x] Audit logs for sensitive actions
- [x] Tests for permission guards

## Phase 2 Ideas
- Stripe billing integration + webhooks
- File uploads via Supabase Storage
- Advanced analytics dashboards
- Custom domain mapping
- Invitation emails + transactional email templates
- SSO for enterprise plans

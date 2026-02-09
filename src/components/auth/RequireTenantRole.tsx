import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import type { UserRole } from '../../types';

export function RequireTenantRole({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) {
  const { loading, platformRole } = useAuth();
  const { membership, loading: tenantLoading } = useTenant();

  if (loading || tenantLoading) return null;
  if (platformRole === 'super_admin') return <>{children}</>;

  const tenantRole = membership?.role ?? null;
  if (!tenantRole || membership?.status !== 'active' || !roles.includes(tenantRole as UserRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

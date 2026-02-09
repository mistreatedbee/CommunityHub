import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { loading, platformRole } = useAuth();

  if (loading) return null;
  if (platformRole !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

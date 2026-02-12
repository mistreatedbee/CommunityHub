import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { loading, user, platformRole, refreshProfile } = useAuth();
  const [verifyingRole, setVerifyingRole] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (loading || !user || platformRole === 'super_admin' || verificationDone || verifyingRole) return;

    setVerifyingRole(true);

    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('platform_role')
          .eq('user_id', user.id)
          .maybeSingle<{ platform_role: 'user' | 'super_admin' }>();

        if (!mounted) return;
        if (error && import.meta.env.DEV) {
          console.debug('[RequireSuperAdmin] verification query failed', error.code, error.message);
        }
        if (data?.platform_role === 'super_admin') {
          if (import.meta.env.DEV) {
            console.debug('[RequireSuperAdmin] verification found super_admin in DB, refreshing context');
          }
          await refreshProfile();
        }
      } finally {
        if (!mounted) return;
        setVerificationDone(true);
        setVerifyingRole(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loading, user, platformRole, refreshProfile, verificationDone, verifyingRole]);

  if (loading || verifyingRole) {
    if (import.meta.env.DEV) {
      console.debug('[RequireSuperAdmin] showing loader (loading or verifying role)');
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }
  if (platformRole !== 'super_admin') {
    if (import.meta.env.DEV) {
      console.debug('[RequireSuperAdmin] redirecting to /login because loading=false and platformRole=', platformRole);
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

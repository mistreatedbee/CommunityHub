import React, { useEffect, useState } from 'react';
import { Users, FileText, Megaphone, Calendar } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { StatsCard } from '../../components/widgets/StatsCard';

export function TenantAdminDashboardPage() {
  const { tenant, license } = useTenant();
  const [memberCount, setMemberCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!tenant) return;
      const [{ count: members }, { count: posts }, { count: resources }, { count: events }] = await Promise.all([
        supabase
          .from('organization_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id)
          .eq('status', 'active'),
        supabase
          .from('tenant_posts')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id),
        supabase
          .from('tenant_resources')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id),
        supabase
          .from('sessions')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id)
      ]);
      setMemberCount(members ?? 0);
      setPostCount(posts ?? 0);
      setResourceCount(resources ?? 0);
      setEventCount(events ?? 0);
    };
    void load();
  }, [tenant?.id]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Admin Overview</h1>
        <p className="text-gray-500">Manage your community hub and track usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Active Members" value={memberCount.toString()} icon={Users} />
        <StatsCard title="Posts" value={postCount.toString()} icon={Megaphone} />
        <StatsCard title="Resources" value={resourceCount.toString()} icon={FileText} />
        <StatsCard title="Events" value={eventCount.toString()} icon={Calendar} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">License Status</h2>
        <p className="text-sm text-gray-600">
          Plan: {license?.license.name ?? 'No plan'} · Status: {license?.status ?? 'unknown'}
        </p>
      </div>
    </div>
  );
}

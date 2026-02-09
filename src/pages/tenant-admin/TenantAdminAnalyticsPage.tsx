import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { StatsCard } from '../../components/widgets/StatsCard';

export function TenantAdminAnalyticsPage() {
  const { tenant } = useTenant();
  const [memberCount, setMemberCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!tenant) return;
      const [{ count: members }, { count: pending }, { count: posts }, { count: groups }, { count: events }, { count: programs }] = await Promise.all([
        supabase
          .from('organization_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id)
          .eq('status', 'active'),
        supabase
          .from('organization_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id)
          .eq('status', 'pending'),
        supabase
          .from('tenant_posts')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id),
        supabase
          .from('groups')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id),
        supabase
          .from('sessions')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id),
        supabase
          .from('programs')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', tenant.id)
      ]);
      setMemberCount(members ?? 0);
      setPendingCount(pending ?? 0);
      setPostCount(posts ?? 0);
      setGroupCount(groups ?? 0);
      setEventCount(events ?? 0);
      setProgramCount(programs ?? 0);
    };
    void load();
  }, [tenant?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">High level tenant usage insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Active Members" value={memberCount.toString()} icon={BarChart2} />
        <StatsCard title="Pending Approvals" value={pendingCount.toString()} icon={BarChart2} />
        <StatsCard title="Posts Published" value={postCount.toString()} icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Groups" value={groupCount.toString()} icon={BarChart2} />
        <StatsCard title="Events" value={eventCount.toString()} icon={BarChart2} />
        <StatsCard title="Programs" value={programCount.toString()} icon={BarChart2} />
      </div>
    </div>
  );
}

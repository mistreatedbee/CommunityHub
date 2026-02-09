import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type ResourceRow = {
  id: string;
  title: string;
  file_url: string;
  access_level: 'public' | 'members' | 'leaders';
  created_at: string;
};

export function TenantMemberResourcesPage() {
  const { user } = useAuth();
  const { tenant, membership } = useTenant();
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!tenant) return;
      setLoading(true);
      const accessFilter =
        membership?.role === 'owner' || membership?.role === 'admin' || membership?.role === 'supervisor'
          ? ['public', 'members', 'leaders']
          : ['public', 'members'];
      const { data: groupRows } = await supabase
        .from('group_memberships')
        .select('group_id')
        .eq('user_id', user?.id ?? '')
        .returns<{ group_id: string }[]>();
      const allowedGroups = groupRows?.map((row) => row.group_id) ?? [];
      const { data } = await supabase
        .from('tenant_resources')
        .select('id, title, file_url, access_level, created_at')
        .eq('organization_id', tenant.id)
        .in('access_level', accessFilter)
        .or(`group_id.is.null,group_id.in.(${allowedGroups.join(',') || '00000000-0000-0000-0000-000000000000'})`)
        .order('created_at', { ascending: false })
        .returns<ResourceRow[]>();
      setResources(data ?? []);
      setLoading(false);
    };
    void load();
  }, [tenant?.id, membership?.role]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-500">Download documents shared by your community.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState icon={FileText} title="No resources yet" description="Resources will appear here once shared." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.file_url}
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-xs text-gray-500 uppercase">{resource.access_level}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

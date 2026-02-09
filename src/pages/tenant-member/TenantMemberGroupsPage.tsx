import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
};

export function TenantMemberGroupsPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [memberGroupIds, setMemberGroupIds] = useState<string[]>([]);

  const loadGroups = async () => {
    if (!tenant) return;
    const { data: groupRows } = await supabase
      .from('groups')
      .select('id, name, description, is_private')
      .eq('organization_id', tenant.id)
      .returns<GroupRow[]>();
    const { data: membershipRows } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', user?.id ?? '')
      .returns<{ group_id: string }[]>();
    setGroups(groupRows ?? []);
    setMemberGroupIds(membershipRows?.map((row) => row.group_id) ?? []);
  };

  useEffect(() => {
    void loadGroups();
  }, [tenant?.id, user?.id]);

  const handleJoin = async (groupId: string) => {
    if (!user) return;
    await supabase.from('group_memberships').upsert({
      group_id: groupId,
      user_id: user.id,
      role: 'member',
      status: 'active'
    });
    await loadGroups();
  };

  const handleLeave = async (groupId: string) => {
    if (!user) return;
    await supabase.from('group_memberships').delete().eq('group_id', groupId).eq('user_id', user.id);
    await loadGroups();
  };

  const visibleGroups = groups.filter((group) => !group.is_private || memberGroupIds.includes(group.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="text-gray-500">Join sub-communities to connect with members.</p>
      </div>

      {visibleGroups.length === 0 ? (
        <EmptyState icon={Users} title="No groups available" description="Ask an admin to create a group." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleGroups.map((group) => {
            const isMember = memberGroupIds.includes(group.id);
            return (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description ?? 'No description.'}</p>
                <div className="mt-3">
                  {isMember ? (
                    <Button size="sm" variant="outline" onClick={() => void handleLeave(group.id)}>
                      Leave group
                    </Button>
                  ) : (
                    !group.is_private && (
                      <Button size="sm" onClick={() => void handleJoin(group.id)}>
                        Join group
                      </Button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

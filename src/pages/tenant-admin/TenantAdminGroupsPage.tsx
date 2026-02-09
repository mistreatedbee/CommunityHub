import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';

type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
};

type MemberRow = {
  user_id: string;
  profile: { full_name: string | null; email: string | null } | null;
};

export function TenantAdminGroupsPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupRow | null>(null);
  const [groupMembers, setGroupMembers] = useState<MemberRow[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const loadGroups = async () => {
    if (!tenant) return;
    const { data } = await supabase
      .from('groups')
      .select('id, name, description, is_private')
      .eq('organization_id', tenant.id)
      .order('created_at', { ascending: false })
      .returns<GroupRow[]>();
    setGroups(data ?? []);
  };

  const loadMembers = async () => {
    if (!tenant) return;
    const { data } = await supabase
      .from('organization_memberships')
      .select('user_id, profile:profiles(full_name, email)')
      .eq('organization_id', tenant.id)
      .eq('status', 'active')
      .returns<MemberRow[]>();
    setMembers(data ?? []);
  };

  const loadGroupMembers = async (groupId: string) => {
    const { data } = await supabase
      .from('group_memberships')
      .select('user_id, profile:profiles(full_name, email)')
      .eq('group_id', groupId)
      .eq('status', 'active')
      .returns<MemberRow[]>();
    setGroupMembers(data ?? []);
  };

  useEffect(() => {
    void loadGroups();
    void loadMembers();
  }, [tenant?.id]);

  useEffect(() => {
    if (selectedGroup) {
      void loadGroupMembers(selectedGroup.id);
    }
  }, [selectedGroup?.id]);

  const handleCreateGroup = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to create groups.', 'error');
      return;
    }
    if (!name.trim()) {
      addToast('Group name is required.', 'error');
      return;
    }
    const { error } = await supabase.from('groups').insert({
      organization_id: tenant.id,
      name,
      description,
      is_private: isPrivate,
      created_by: user.id
    });
    if (error) {
      addToast('Unable to create group.', 'error');
      return;
    }
    await logAudit('group_created', tenant.id, { name });
    setName('');
    setDescription('');
    setIsPrivate(false);
    await loadGroups();
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !selectedMemberId) return;
    await supabase.from('group_memberships').upsert({
      group_id: selectedGroup.id,
      user_id: selectedMemberId,
      role: 'member',
      status: 'active'
    });
    await logAudit('group_member_added', tenant?.id ?? null, { group_id: selectedGroup.id, user_id: selectedMemberId });
    await loadGroupMembers(selectedGroup.id);
    setSelectedMemberId('');
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedGroup) return;
    await supabase.from('group_memberships').delete().eq('group_id', selectedGroup.id).eq('user_id', userId);
    await logAudit('group_member_removed', tenant?.id ?? null, { group_id: selectedGroup.id, user_id: userId });
    await loadGroupMembers(selectedGroup.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="text-gray-500">Create sub-communities and manage membership.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Group name" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          Private group
        </label>
        <Button onClick={() => void handleCreateGroup()}>Create group</Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState icon={Users} title="No groups yet" description="Create a group to organize members." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            {groups.map((group) => (
              <button
                type="button"
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`w-full text-left px-3 py-2 rounded-lg border ${selectedGroup?.id === group.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="text-sm font-semibold text-gray-900">{group.name}</div>
                <div className="text-xs text-gray-500">{group.is_private ? 'Private' : 'Public'}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            {selectedGroup ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-sm text-gray-500">{selectedGroup.description ?? 'No description.'}</p>
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Add member</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.profile?.full_name ?? member.profile?.email ?? 'Member'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={() => void handleAddMember()}>Add</Button>
                </div>
                <div className="space-y-2">
                  {groupMembers.length === 0 ? (
                    <p className="text-sm text-gray-500">No members in this group.</p>
                  ) : (
                    groupMembers.map((member) => (
                      <div key={member.user_id} className="flex items-center justify-between text-sm">
                        <span>{member.profile?.full_name ?? member.profile?.email ?? 'Member'}</span>
                        <Button size="sm" variant="ghost" onClick={() => void handleRemoveMember(member.user_id)}>
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a group to manage members.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

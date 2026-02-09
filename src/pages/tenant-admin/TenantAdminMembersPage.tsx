import React, { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';
import { notifyTenantMembers } from '../../utils/notifications';

type MemberRow = {
  user_id: string;
  role: 'owner' | 'admin' | 'supervisor' | 'employee' | 'member';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  profile: { full_name: string | null; email: string | null } | null;
};

export function TenantAdminMembersPage() {
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('organization_memberships')
      .select('user_id, role, status, created_at, profile:profiles(full_name, email)')
      .eq('organization_id', tenant.id)
      .order('created_at', { ascending: false })
      .returns<MemberRow[]>();
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadMembers();
  }, [tenant?.id]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) =>
      [member.profile?.full_name, member.profile?.email, member.role]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [members, search]);

  const handleExport = () => {
    const rows = filtered.map((member) => ({
      name: member.profile?.full_name ?? '',
      email: member.profile?.email ?? '',
      role: member.role,
      status: member.status,
      joined_at: member.created_at
    }));
    const header = ['name', 'email', 'role', 'status', 'joined_at'];
    const csv = [header.join(','), ...rows.map((row) => header.map((key) => `"${(row as any)[key] ?? ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `members-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusUpdate = async (member: MemberRow, status: MemberRow['status']) => {
    if (!tenant) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to manage members.', 'error');
      return;
    }
    if (status === 'active') {
      const maxMembers = license?.license.max_members ?? null;
      if (maxMembers) {
        const activeCount = members.filter((m) => m.status === 'active').length;
        if (activeCount >= maxMembers) {
          addToast('Member limit reached for this plan.', 'error');
          return;
        }
      }
    }
    const { error } = await supabase
      .from('organization_memberships')
      .update({ status })
      .eq('organization_id', tenant.id)
      .eq('user_id', member.user_id);
    if (error) {
      addToast('Unable to update member status.', 'error');
      return;
    }
    await logAudit('member_status_updated', tenant.id, { user_id: member.user_id, status });
    if (status === 'active') {
      await supabase.from('notifications').insert({
        organization_id: tenant.id,
        user_id: member.user_id,
        type: 'membership',
        title: 'Membership approved',
        body: 'Your membership has been approved.'
      });
      await notifyTenantMembers(tenant.id, {
        type: 'member',
        title: 'New member approved',
        body: `${member.profile?.full_name ?? 'A member'} was approved.`
      });
    }
    await loadMembers();
  };

  const handleRoleUpdate = async (member: MemberRow, role: MemberRow['role']) => {
    if (!tenant) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to manage roles.', 'error');
      return;
    }
    const maxAdmins = license?.license.max_admins ?? null;
    if (role === 'admin' && maxAdmins) {
      const adminCount = members.filter((m) => m.role === 'admin' && m.status === 'active').length;
      if (adminCount >= maxAdmins) {
        addToast('Admin limit reached for this plan.', 'error');
        return;
      }
    }
    const { error } = await supabase
      .from('organization_memberships')
      .update({ role })
      .eq('organization_id', tenant.id)
      .eq('user_id', member.user_id);
    if (error) {
      addToast('Unable to update role.', 'error');
      return;
    }
    await logAudit('member_role_updated', tenant.id, { user_id: member.user_id, role });
    await loadMembers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-500">Approve, manage, and assign roles.</p>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExport}>Export CSV</Button>
      </div>

      <Input
        placeholder="Search members..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <div className="text-gray-500">Loading members...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No members found" description="Invite members to get started." />
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => (
            <div key={member.user_id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {member.profile?.full_name ?? 'Unnamed'}
                  </p>
                  <p className="text-xs text-gray-500">{member.profile?.email ?? 'No email'}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    className="border border-gray-200 rounded-lg text-sm p-2"
                    value={member.role}
                    onChange={(event) => void handleRoleUpdate(member, event.target.value as MemberRow['role'])}
                  >
                    <option value="member">Member</option>
                    <option value="employee">Staff</option>
                    <option value="supervisor">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  {member.status !== 'active' ? (
                    <Button size="sm" onClick={() => void handleStatusUpdate(member, 'active')}>
                      Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => void handleStatusUpdate(member, 'inactive')}>
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

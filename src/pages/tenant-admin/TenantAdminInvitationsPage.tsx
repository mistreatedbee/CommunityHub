import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';

type InvitationRow = {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'supervisor' | 'employee' | 'member';
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
};

export function TenantAdminInvitationsPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InvitationRow['role']>('member');
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);

  const loadInvites = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('invitations')
      .select('id, email, role, status, expires_at, created_at')
      .eq('organization_id', tenant.id)
      .order('created_at', { ascending: false })
      .returns<InvitationRow[]>();
    setInvitations(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadInvites();
  }, [tenant?.id]);

  const handleInvite = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to send invitations.', 'error');
      return;
    }
    if (!email.trim()) {
      addToast('Email is required.', 'error');
      return;
    }
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    const { error } = await supabase.from('invitations').insert({
      organization_id: tenant.id,
      email,
      role,
      token,
      expires_at: expiresAt,
      invited_by: user.id
    });
    if (error) {
      addToast('Unable to send invitation.', 'error');
      return;
    }
    await logAudit('invitation_created', tenant.id, { email, role });
    addToast('Invitation created.', 'success');
    setEmail('');
    setRole('member');
    await loadInvites();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
        <p className="text-gray-500">Invite members or staff to your community.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
            value={role}
            onChange={(event) => setRole(event.target.value as InvitationRow['role'])}
          >
            <option value="member">Member</option>
            <option value="employee">Staff</option>
            <option value="supervisor">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button onClick={() => void handleInvite()}>Send invitation</Button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading invitations...</div>
      ) : invitations.length === 0 ? (
        <EmptyState icon={Mail} title="No invitations" description="Create the first invite to onboard members." />
      ) : (
        <div className="space-y-3">
          {invitations.map((invite) => (
            <div key={invite.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{invite.email}</p>
                  <p className="text-xs text-gray-500">{invite.role} · {invite.status}</p>
                </div>
                <span className="text-xs text-gray-500">Expires {new Date(invite.expires_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { supabase } from '../lib/supabase';

type NotificationPayload = {
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
};

export async function notifyTenantMembers(organizationId: string, payload: NotificationPayload) {
  const { data: members } = await supabase
    .from('organization_memberships')
    .select('user_id')
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  if (!members || members.length === 0) return;

  const notifications = members.map((member) => ({
    organization_id: organizationId,
    user_id: member.user_id,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {}
  }));

  await supabase.from('notifications').insert(notifications);
}

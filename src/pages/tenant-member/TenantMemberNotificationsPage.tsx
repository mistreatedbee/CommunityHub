import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type NotificationRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export function TenantMemberNotificationsPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user || !tenant) return;
      setLoading(true);
      const { data } = await supabase
        .from('notifications')
        .select('id, title, body, created_at, read_at')
        .eq('user_id', user.id)
        .eq('organization_id', tenant.id)
        .order('created_at', { ascending: false })
        .returns<NotificationRow[]>();
      setNotifications(data ?? []);
      setLoading(false);
    };
    void load();
  }, [user?.id, tenant?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500">Updates about your membership and community activity.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{notification.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

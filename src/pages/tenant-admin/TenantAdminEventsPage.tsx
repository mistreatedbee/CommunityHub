import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';
import { notifyTenantMembers } from '../../utils/notifications';

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  meeting_link: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
};

export function TenantAdminEventsPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const loadSessions = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('sessions')
      .select('id, title, description, scheduled_at, duration_minutes, location, meeting_link, status')
      .eq('organization_id', tenant.id)
      .order('scheduled_at', { ascending: false })
      .returns<SessionRow[]>();
    setSessions(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadSessions();
  }, [tenant?.id]);

  const handleCreate = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to create events.', 'error');
      return;
    }
    if (!title.trim() || !scheduledAt) {
      addToast('Title and date/time are required.', 'error');
      return;
    }
    const { error } = await supabase.from('sessions').insert({
      organization_id: tenant.id,
      title,
      description,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: duration,
      location,
      meeting_link: meetingLink,
      host_user_id: user.id,
      status: 'scheduled'
    });
    if (error) {
      addToast('Unable to create event.', 'error');
      return;
    }
    await logAudit('event_created', tenant.id, { title });
    await notifyTenantMembers(tenant.id, {
      type: 'event',
      title: `New event: ${title}`,
      body: description || 'An event has been scheduled.'
    });
    setTitle('');
    setDescription('');
    setScheduledAt('');
    setDuration(60);
    setLocation('');
    setMeetingLink('');
    await loadSessions();
  };

  const handleCancel = async (sessionId: string) => {
    if (!tenant) return;
    await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', sessionId)
      .eq('organization_id', tenant.id);
    await logAudit('event_cancelled', tenant.id, { session_id: sessionId });
    await loadSessions();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500">Schedule events and manage attendance.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & time</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <Input
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Input label="Meeting link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
        </div>
        <Button onClick={() => void handleCreate()}>Create event</Button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading events...</div>
      ) : sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No events yet" description="Schedule your first event." />
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{session.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(session.scheduled_at).toLocaleString()} · {session.status}
                  </p>
                </div>
                {session.status === 'scheduled' && (
                  <Button size="sm" variant="ghost" onClick={() => void handleCancel(session.id)}>
                    Cancel
                  </Button>
                )}
              </div>
              {session.description && <p className="text-sm text-gray-600 mt-2">{session.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

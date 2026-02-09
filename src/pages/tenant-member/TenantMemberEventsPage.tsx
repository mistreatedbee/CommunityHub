import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  location: string | null;
  meeting_link: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
};

type RsvpRow = {
  session_id: string;
  status: 'going' | 'maybe' | 'not_going';
};

export function TenantMemberEventsPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, RsvpRow['status']>>({});
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    if (!tenant || !user) return;
    setLoading(true);
    const [{ data: sessionRows }, { data: rsvpRows }] = await Promise.all([
      supabase
        .from('sessions')
        .select('id, title, description, scheduled_at, location, meeting_link, status')
        .eq('organization_id', tenant.id)
        .neq('status', 'cancelled')
        .order('scheduled_at', { ascending: true })
        .returns<SessionRow[]>(),
      supabase
        .from('session_rsvps')
        .select('session_id, status')
        .eq('user_id', user.id)
        .returns<RsvpRow[]>()
    ]);
    setSessions(sessionRows ?? []);
    const map: Record<string, RsvpRow['status']> = {};
    (rsvpRows ?? []).forEach((row) => {
      map[row.session_id] = row.status;
    });
    setRsvps(map);
    setLoading(false);
  };

  useEffect(() => {
    void loadEvents();
  }, [tenant?.id, user?.id]);

  const handleRsvp = async (sessionId: string, status: RsvpRow['status']) => {
    if (!user) return;
    await supabase.from('session_rsvps').upsert({
      session_id: sessionId,
      user_id: user.id,
      status
    });
    setRsvps((prev) => ({ ...prev, [sessionId]: status }));
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500">RSVP to upcoming events and sessions.</p>
      </div>

      {sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No events scheduled" description="Check back soon for updates." />
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{session.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(session.scheduled_at).toLocaleString()} · {session.status}
                  </p>
                </div>
              </div>
              {session.description && <p className="text-sm text-gray-600 mt-2">{session.description}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant={rsvps[session.id] === 'going' ? 'default' : 'outline'} onClick={() => void handleRsvp(session.id, 'going')}>
                  Going
                </Button>
                <Button size="sm" variant={rsvps[session.id] === 'maybe' ? 'default' : 'outline'} onClick={() => void handleRsvp(session.id, 'maybe')}>
                  Maybe
                </Button>
                <Button size="sm" variant={rsvps[session.id] === 'not_going' ? 'default' : 'outline'} onClick={() => void handleRsvp(session.id, 'not_going')}>
                  Can’t go
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

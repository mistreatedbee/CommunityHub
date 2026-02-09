import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  visibility: 'public' | 'members' | 'leaders';
  is_pinned: boolean;
  published_at: string;
};

export function TenantMemberAnnouncementsPage() {
  const { tenant, membership } = useTenant();
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!tenant) return;
      setLoading(true);
      const visibilityFilter =
        membership?.role === 'owner' || membership?.role === 'admin' || membership?.role === 'supervisor'
          ? ['public', 'members', 'leaders']
          : ['public', 'members'];
      const { data } = await supabase
        .from('announcements')
        .select('id, title, content, visibility, is_pinned, published_at')
        .eq('organization_id', tenant.id)
        .in('visibility', visibilityFilter)
        .lte('published_at', new Date().toISOString())
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .returns<AnnouncementRow[]>();
      setAnnouncements(data ?? []);
      setLoading(false);
    };
    void load();
  }, [tenant?.id, membership?.role]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500">Important updates from your community.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Check back later for updates." />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {announcement.title}
                  {announcement.is_pinned && <span className="ml-2 text-xs text-blue-600">Pinned</span>}
                </h3>
                <span className="text-xs text-gray-500">{new Date(announcement.published_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

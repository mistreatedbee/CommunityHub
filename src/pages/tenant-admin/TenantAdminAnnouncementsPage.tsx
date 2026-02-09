import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';
import { notifyTenantMembers } from '../../utils/notifications';

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  visibility: 'public' | 'members' | 'leaders';
  is_pinned: boolean;
  published_at: string;
};

export function TenantAdminAnnouncementsPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<AnnouncementRow['visibility']>('members');
  const [isPinned, setIsPinned] = useState(false);
  const [publishAt, setPublishAt] = useState('');

  const loadAnnouncements = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('announcements')
      .select('id, title, content, visibility, is_pinned, published_at')
      .eq('organization_id', tenant.id)
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .returns<AnnouncementRow[]>();
    setAnnouncements(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadAnnouncements();
  }, [tenant?.id]);

  const handleCreate = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to publish announcements.', 'error');
      return;
    }
    if (!title.trim() || !content.trim()) {
      addToast('Title and content are required.', 'error');
      return;
    }
    const publishedAt = publishAt ? new Date(publishAt).toISOString() : new Date().toISOString();
    const { error } = await supabase.from('announcements').insert({
      organization_id: tenant.id,
      author_user_id: user.id,
      title,
      content,
      visibility,
      is_pinned: isPinned,
      published_at: publishedAt
    });
    if (error) {
      addToast('Unable to create announcement.', 'error');
      return;
    }
    await logAudit('announcement_created', tenant.id, { title, visibility, isPinned });
    await notifyTenantMembers(tenant.id, {
      type: 'announcement',
      title: `Announcement: ${title}`,
      body: content.slice(0, 140)
    });
    setTitle('');
    setContent('');
    setVisibility('members');
    setIsPinned(false);
    setPublishAt('');
    await loadAnnouncements();
  };

  const handleTogglePin = async (announcement: AnnouncementRow) => {
    if (!tenant) return;
    await supabase
      .from('announcements')
      .update({ is_pinned: !announcement.is_pinned })
      .eq('id', announcement.id)
      .eq('organization_id', tenant.id);
    await logAudit('announcement_pinned', tenant.id, { announcement_id: announcement.id, pinned: !announcement.is_pinned });
    await loadAnnouncements();
  };

  const handleDelete = async (announcementId: string) => {
    if (!tenant) return;
    await supabase.from('announcements').delete().eq('id', announcementId).eq('organization_id', tenant.id);
    await logAudit('announcement_deleted', tenant.id, { announcement_id: announcementId });
    await loadAnnouncements();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500">Publish important updates to your members.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Visibility</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as AnnouncementRow['visibility'])}
            >
              <option value="public">Public</option>
              <option value="members">Members</option>
              <option value="leaders">Leaders</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish at</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
              Pin announcement
            </label>
          </div>
        </div>
        <Button onClick={() => void handleCreate()}>Publish announcement</Button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Create your first announcement." />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {announcement.title}
                    {announcement.is_pinned && <span className="ml-2 text-xs text-blue-600">Pinned</span>}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {announcement.visibility} · {new Date(announcement.published_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => void handleTogglePin(announcement)}>
                    {announcement.is_pinned ? 'Unpin' : 'Pin'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => void handleDelete(announcement.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

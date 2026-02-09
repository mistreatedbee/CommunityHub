import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MessageSquare } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type PostRow = {
  id: string;
  title: string;
  content: string;
  visibility: 'public' | 'members' | 'leaders';
  published_at: string;
};

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  published_at: string;
};

export function TenantMemberFeedPage() {
  const { user } = useAuth();
  const { tenant, membership } = useTenant();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'members' | 'leaders'>('members');
  const [saving, setSaving] = useState(false);

  const canPost = useMemo(() => {
    return membership?.role === 'owner' || membership?.role === 'admin' || membership?.role === 'supervisor';
  }, [membership?.role]);

  const loadPosts = async () => {
    if (!tenant) return;
    setLoading(true);
    const visibilityFilter =
      membership?.role === 'owner' || membership?.role === 'admin' || membership?.role === 'supervisor'
        ? ['public', 'members', 'leaders']
        : ['public', 'members'];
    const { data: groupRows } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', user?.id ?? '')
      .returns<{ group_id: string }[]>();
    const allowedGroups = groupRows?.map((row) => row.group_id) ?? [];
    const { data } = await supabase
      .from('tenant_posts')
      .select('id, title, content, visibility, published_at')
      .eq('organization_id', tenant.id)
      .eq('is_published', true)
      .in('visibility', visibilityFilter)
      .or(`group_id.is.null,group_id.in.(${allowedGroups.join(',') || '00000000-0000-0000-0000-000000000000'})`)
      .order('published_at', { ascending: false })
      .returns<PostRow[]>();
    setPosts(data ?? []);
    const { data: announcementRows } = await supabase
      .from('announcements')
      .select('id, title, content, is_pinned, published_at')
      .eq('organization_id', tenant.id)
      .in('visibility', visibilityFilter)
      .lte('published_at', new Date().toISOString())
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3)
      .returns<AnnouncementRow[]>();
    setAnnouncements(announcementRows ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadPosts();
  }, [tenant?.id, membership?.role, user?.id]);

  const handleCreate = async () => {
    if (!tenant || !user) return;
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await supabase.from('tenant_posts').insert({
      organization_id: tenant.id,
      created_by: user.id,
      title,
      content,
      visibility,
      is_published: true
    });
    setTitle('');
    setContent('');
    setVisibility('members');
    setSaving(false);
    await loadPosts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
        <p className="text-gray-500">Latest posts from your community.</p>
      </div>

      {announcements.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Latest announcements</h2>
          {announcements.map((announcement) => (
            <div key={announcement.id}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{announcement.title}</h3>
                <span className="text-xs text-gray-500">{new Date(announcement.published_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}

      {canPost && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Create a post</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Visibility</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostRow['visibility'])}
            >
              <option value="public">Public</option>
              <option value="members">Members</option>
              <option value="leaders">Leaders</option>
            </select>
          </div>
          <Button onClick={() => void handleCreate()} isLoading={saving}>
            Publish post
          </Button>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No posts yet" description="Start the conversation by creating a post." />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <span className="text-xs text-gray-500 uppercase">{post.visibility}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{new Date(post.published_at).toLocaleString()}</p>
              <p className="text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

type PostRow = {
  id: string;
  title: string;
  content: string;
  visibility: 'public' | 'members' | 'leaders';
  published_at: string;
};

type GroupRow = {
  id: string;
  name: string;
};

export function TenantAdminContentPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<PostRow['visibility']>('members');
  const [groupId, setGroupId] = useState('');
  const [publishAt, setPublishAt] = useState('');

  const loadPosts = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('tenant_posts')
      .select('id, title, content, visibility, published_at')
      .eq('organization_id', tenant.id)
      .order('published_at', { ascending: false })
      .returns<PostRow[]>();
    setPosts(data ?? []);
    setLoading(false);
  };

  const loadGroups = async () => {
    if (!tenant) return;
    const { data } = await supabase.from('groups').select('id, name').eq('organization_id', tenant.id).returns<GroupRow[]>();
    setGroups(data ?? []);
  };

  useEffect(() => {
    void loadPosts();
    void loadGroups();
  }, [tenant?.id]);

  const handleCreate = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to publish new posts.', 'error');
      return;
    }
    if (!title.trim() || !content.trim()) {
      addToast('Title and content are required.', 'error');
      return;
    }
    const maxPosts = license?.license.max_posts ?? null;
    if (maxPosts && posts.length >= maxPosts) {
      addToast('Post limit reached for this plan.', 'error');
      return;
    }
    const { error } = await supabase.from('tenant_posts').insert({
      organization_id: tenant.id,
      created_by: user.id,
      title,
      content,
      visibility,
      is_published: true,
      group_id: groupId || null,
      published_at: publishAt ? new Date(publishAt).toISOString() : new Date().toISOString()
    });
    if (error) {
      addToast('Unable to create post.', 'error');
      return;
    }
    await logAudit('post_created', tenant.id, { title, visibility });
    await notifyTenantMembers(tenant.id, {
      type: 'post',
      title: `New post: ${title}`,
      body: content.slice(0, 140)
    });
    setTitle('');
    setContent('');
    setVisibility('members');
    setGroupId('');
    setPublishAt('');
    await loadPosts();
  };

  const handleDelete = async (postId: string) => {
    if (!tenant) return;
    await supabase.from('tenant_posts').delete().eq('id', postId).eq('organization_id', tenant.id);
    await logAudit('post_deleted', tenant.id, { post_id: postId });
    await loadPosts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content</h1>
        <p className="text-gray-500">Publish posts to your community.</p>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Group (optional)</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">All members</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
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
        <Button onClick={() => void handleCreate()}>Publish post</Button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Megaphone} title="No posts yet" description="Create your first post to engage members." />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-xs text-gray-500">{post.visibility} · {new Date(post.published_at).toLocaleDateString()}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => void handleDelete(post.id)}>
                  Delete
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

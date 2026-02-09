import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';

type ResourceRow = {
  id: string;
  title: string;
  file_url: string;
  access_level: 'public' | 'members' | 'leaders';
  created_at: string;
};

type FolderRow = {
  id: string;
  name: string;
};

type GroupRow = {
  id: string;
  name: string;
};

export function TenantAdminResourcesPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [accessLevel, setAccessLevel] = useState<ResourceRow['access_level']>('members');
  const [folderId, setFolderId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [folderName, setFolderName] = useState('');

  const loadResources = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('tenant_resources')
      .select('id, title, file_url, access_level, created_at')
      .eq('organization_id', tenant.id)
      .order('created_at', { ascending: false })
      .returns<ResourceRow[]>();
    setResources(data ?? []);
    setLoading(false);
  };

  const loadFoldersAndGroups = async () => {
    if (!tenant) return;
    const [{ data: folderRows }, { data: groupRows }] = await Promise.all([
      supabase.from('resource_folders').select('id, name').eq('organization_id', tenant.id).returns<FolderRow[]>(),
      supabase.from('groups').select('id, name').eq('organization_id', tenant.id).returns<GroupRow[]>()
    ]);
    setFolders(folderRows ?? []);
    setGroups(groupRows ?? []);
  };

  useEffect(() => {
    void loadResources();
    void loadFoldersAndGroups();
  }, [tenant?.id]);

  const handleCreate = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to add resources.', 'error');
      return;
    }
    if (!title.trim() || !fileUrl.trim()) {
      addToast('Title and file URL are required.', 'error');
      return;
    }
    const maxResources = license?.license.max_resources ?? null;
    if (maxResources && resources.length >= maxResources) {
      addToast('Resource limit reached for this plan.', 'error');
      return;
    }
    const { error } = await supabase.from('tenant_resources').insert({
      organization_id: tenant.id,
      created_by: user.id,
      title,
      file_url: fileUrl,
      access_level: accessLevel,
      folder_id: folderId || null,
      group_id: groupId || null
    });
    if (error) {
      addToast('Unable to add resource.', 'error');
      return;
    }
    await logAudit('resource_created', tenant.id, { title, accessLevel });
    setTitle('');
    setFileUrl('');
    setAccessLevel('members');
    setFolderId('');
    setGroupId('');
    await loadResources();
  };

  const handleCreateFolder = async () => {
    if (!tenant) return;
    if (!folderName.trim()) {
      addToast('Folder name is required.', 'error');
      return;
    }
    const { error } = await supabase.from('resource_folders').insert({
      organization_id: tenant.id,
      name: folderName,
      created_by: user?.id ?? null
    });
    if (error) {
      addToast('Unable to create folder.', 'error');
      return;
    }
    setFolderName('');
    await loadFoldersAndGroups();
  };

  const handleDelete = async (resourceId: string) => {
    if (!tenant) return;
    await supabase.from('tenant_resources').delete().eq('id', resourceId).eq('organization_id', tenant.id);
    await logAudit('resource_deleted', tenant.id, { resource_id: resourceId });
    await loadResources();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-500">Upload and share resources with members.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="File URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Folder</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Group access (optional)</label>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Access level</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as ResourceRow['access_level'])}
          >
            <option value="public">Public</option>
            <option value="members">Members</option>
            <option value="leaders">Leaders</option>
          </select>
        </div>
        <Button onClick={() => void handleCreate()}>Add resource</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Create folder</h2>
        <div className="flex gap-3">
          <Input label="Folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          <Button onClick={() => void handleCreateFolder()}>Create</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading resources...</div>
      ) : resources.length === 0 ? (
        <EmptyState icon={FileText} title="No resources yet" description="Upload your first resource." />
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{resource.title}</h3>
                <p className="text-xs text-gray-500">{resource.access_level} · {new Date(resource.created_at).toLocaleDateString()}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => void handleDelete(resource.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

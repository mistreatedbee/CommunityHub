import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Lock, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Group } from '../../types';
export function AdminGroupsPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const [groups, setGroups] = useState<Group[]>([
  {
    id: '1',
    name: 'Product Designers',
    description: 'A space for product designers...',
    memberCount: 142,
    isPrivate: false,
    imageUrl:
    'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'San Francisco Chapter',
    description: 'Local community members...',
    memberCount: 85,
    isPrivate: true
  }]
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500">Manage community groups and circles.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}>

          Create Group
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Group Name</TableHeader>
              <TableHeader>Privacy</TableHeader>
              <TableHeader>Members</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) =>
            <TableRow key={group.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {group.imageUrl ?
                    <img
                      src={group.imageUrl}
                      alt=""
                      className="w-full h-full object-cover" /> :


                    <Users className="w-5 h-5 text-gray-400" />
                    }
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {group.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {group.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {group.isPrivate ?
                <Badge
                  variant="warning"
                  className="flex items-center w-fit gap-1">

                      <Lock className="w-3 h-3" /> Private
                    </Badge> :

                <Badge
                  variant="success"
                  className="flex items-center w-fit gap-1">

                      <Globe className="w-3 h-3" /> Public
                    </Badge>
                }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-3 h-3" />
                    {group.memberCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50">

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Group"
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addToast('Group created', 'success');
              setIsModalOpen(false);
            }}>

              Create Group
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Group Name" placeholder="e.g. Marketing Team" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={3}
              placeholder="What is this group about?" />

          </div>
          <Input label="Cover Image URL" placeholder="https://..." />
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="private"
              className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

            <label htmlFor="private" className="text-sm text-gray-700">
              Make this group private (invite only)
            </label>
          </div>
        </div>
      </Modal>
    </div>);

}
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Pin, Eye, EyeOff } from 'lucide-react';
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
import { Announcement } from '../../types';
export function AdminAnnouncementsPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Mock Data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
  {
    id: '1',
    title: 'New Community Guidelines',
    content: 'We have updated our community guidelines...',
    date: '2024-03-01',
    isPinned: true,
    author: 'Admin Team',
    category: 'urgent',
    visibility: 'public'
  },
  {
    id: '2',
    title: 'Platform Maintenance',
    content: 'Scheduled maintenance for next week...',
    date: '2024-03-05',
    isPinned: false,
    author: 'Tech Support',
    category: 'general',
    visibility: 'members'
  }]
  );
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
      addToast('Announcement deleted', 'success');
    }
  };
  const handlePin = (id: string) => {
    setAnnouncements(
      announcements.map((a) =>
      a.id === id ?
      {
        ...a,
        isPinned: !a.isPinned
      } :
      a
      )
    );
    addToast('Pin status updated', 'success');
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500">
            Manage community announcements and updates.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}>

          New Announcement
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Title</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Visibility</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) =>
            <TableRow key={announcement.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">
                    {announcement.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {announcement.content}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                  variant={
                  announcement.category === 'urgent' ? 'danger' : 'default'
                  }>

                    {announcement.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    {announcement.visibility === 'public' ?
                  <Eye className="w-3 h-3" /> :

                  <EyeOff className="w-3 h-3" />
                  }
                    <span className="capitalize">
                      {announcement.visibility}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(announcement.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {announcement.isPinned &&
                <Badge
                  variant="info"
                  className="flex items-center w-fit gap-1">

                      <Pin className="w-3 h-3" /> Pinned
                    </Badge>
                }
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePin(announcement.id)}
                    title={announcement.isPinned ? 'Unpin' : 'Pin'}>

                      <Pin
                      className={`w-4 h-4 ${announcement.isPinned ? 'fill-current' : ''}`} />

                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(announcement.id)}>

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
        title="Create Announcement"
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addToast('Announcement created', 'success');
              setIsModalOpen(false);
            }}>

              Create
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Title" placeholder="Enter announcement title" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={4}
              placeholder="Write your announcement..." />

          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white">
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
                <option value="news">News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white">
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="leaders">Leaders Only</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin"
              className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

            <label htmlFor="pin" className="text-sm text-gray-700">
              Pin to top
            </label>
          </div>
        </div>
      </Modal>
    </div>);

}
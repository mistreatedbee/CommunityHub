import React from 'react';
import {
  Search,
  Flag,
  Lock,
  Trash2,
  MessageSquare,
  AlertTriangle } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
export function AdminDiscussionsPage() {
  // Mock Data
  const flaggedContent = [
  {
    id: '1',
    content: 'This is inappropriate content...',
    author: 'User123',
    reason: 'Harassment',
    date: '2024-03-10',
    type: 'comment'
  }];

  const AllThreads = () =>
  <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
          type="text"
          placeholder="Search discussions..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Topic</TableHeader>
            <TableHeader>Author</TableHeader>
            <TableHeader>Replies</TableHeader>
            <TableHeader>Last Active</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="font-medium text-gray-900">
                Welcome to the community!
              </div>
              <div className="text-xs text-gray-500">General Discussion</div>
            </TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>24</TableCell>
            <TableCell>2 hours ago</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" title="Lock Thread">
                  <Lock className="w-4 h-4" />
                </Button>
                <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50">

                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>;

  const FlaggedContent = () =>
  <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Content</TableHeader>
          <TableHeader>Author</TableHeader>
          <TableHeader>Reason</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {flaggedContent.map((item) =>
      <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {item.type === 'comment' ? 'Comment' : 'Thread'}
                  </div>
                  <div className="text-sm text-gray-500 italic">
                    "{item.content}"
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>
              <Badge variant="danger">{item.reason}</Badge>
            </TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Dismiss
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
      )}
      </TableBody>
    </Table>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Discussions & Moderation
        </h1>
        <p className="text-gray-500">
          Manage community conversations and flagged content.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <Tabs
          tabs={[
          {
            id: 'all',
            label: 'All Threads',
            content: <AllThreads />
          },
          {
            id: 'flagged',
            label: 'Flagged Content',
            content: <FlaggedContent />
          }]
          } />

      </div>
    </div>);

}
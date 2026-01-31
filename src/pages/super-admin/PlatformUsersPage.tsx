import React, { useState } from 'react';
import { Search, MoreHorizontal, User, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Dropdown } from '../../components/ui/Dropdown';
import { useToast } from '../../components/ui/Toast';
import { User as UserType } from '../../types';
export function PlatformUsersPage() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  // Mock Data
  const users: UserType[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah@techinnovators.com',
    role: 'admin',
    organizationId: '1',
    joinedAt: '2024-03-10',
    status: 'active',
    lastActiveAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@greenearth.org',
    role: 'admin',
    organizationId: '2',
    joinedAt: '2024-03-08',
    status: 'active',
    lastActiveAt: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily@designcollective.io',
    role: 'admin',
    organizationId: '3',
    joinedAt: '2024-02-15',
    status: 'inactive',
    lastActiveAt: '2024-02-28T09:15:00Z'
  }];

  const handleImpersonate = (user: UserType) => {
    if (
    window.confirm(
      `Are you sure you want to impersonate ${user.name}? You will see the platform exactly as they do.`
    ))
    {
      addToast(`Impersonating ${user.name}...`, 'info');
      // In a real app, this would trigger a session switch
    }
  };
  const filteredUsers = users.filter(
    (user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Users</h1>
          <p className="text-gray-500">
            Manage admin users across all organizations.
          </p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>User</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Organization</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Active</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) =>
              <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar alt={user.name} size="sm" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      Org #{user.organizationId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                    variant={
                    user.status === 'active' ? 'success' : 'secondary'
                    }>

                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {user.lastActiveAt ?
                    new Date(user.lastActiveAt).toLocaleDateString() :
                    'Never'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dropdown
                    align="right"
                    trigger={
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                    }
                    items={[
                    {
                      label: 'Impersonate',
                      onClick: () => handleImpersonate(user),
                      icon: <LogIn className="w-4 h-4" />
                    },
                    {
                      label: 'View Details',
                      icon: <User className="w-4 h-4" />
                    }]
                    } />

                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>);

}
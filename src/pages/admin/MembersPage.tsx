import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  Trash2 } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Dropdown } from '../../components/ui/Dropdown';
import { User } from '../../types';
export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Mock Data
  const members: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'member',
    organizationId: 'org1',
    joinedAt: '2023-11-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'admin',
    organizationId: 'org1',
    joinedAt: '2023-10-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Brown',
    email: 'mike@example.com',
    role: 'leader',
    organizationId: 'org1',
    joinedAt: '2024-01-20',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'member',
    organizationId: 'org1',
    joinedAt: '2024-02-10',
    status: 'inactive'
  }];

  const filteredMembers = members.filter(
    (member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'leader':
        return 'warning';
      default:
        return 'default';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500">
            Manage your community members and their roles.
          </p>
        </div>
        <Button>Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1">
          <Input
            placeholder="Search members..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-200" />

        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Role
          </Button>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Status
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Member</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Joined</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) =>
            <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar alt={member.name} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                  variant={member.status === 'active' ? 'success' : 'default'}>

                    {member.status.charAt(0).toUpperCase() +
                  member.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(member.joinedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Dropdown
                  align="right"
                  trigger={
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                  }
                  items={[
                  {
                    label: 'View Profile',
                    href: `/admin/members/${member.id}`
                  },
                  {
                    label: 'Send Message',
                    icon: <Mail className="w-4 h-4" />
                  },
                  {
                    label: 'Change Role',
                    icon: <Shield className="w-4 h-4" />
                  },
                  {
                    label: 'Deactivate',
                    danger: true,
                    icon: <Trash2 className="w-4 h-4" />
                  }]
                  } />

                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination (Mock) */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing 1 to {filteredMembers.length} of {filteredMembers.length}{' '}
            results
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
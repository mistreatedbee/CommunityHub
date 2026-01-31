import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MoreHorizontal,
  Plus,
  Building2,
  Trash2,
  Ban,
  CheckCircle } from
'lucide-react';
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
import { Dropdown } from '../../components/ui/Dropdown';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { OrganizationWithPlan } from '../../types';
export function OrganizationsPage() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Mock Data
  const [organizations, setOrganizations] = useState<OrganizationWithPlan[]>([
  {
    id: '1',
    name: 'Tech Innovators',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    planId: 'pro',
    planName: 'Pro Plan',
    status: 'active',
    createdAt: '2024-03-10',
    adminCount: 2,
    memberCount: 145
  },
  {
    id: '2',
    name: 'Green Earth Initiative',
    primaryColor: '#10B981',
    secondaryColor: '#F59E0B',
    planId: 'starter',
    planName: 'Starter',
    status: 'trial',
    createdAt: '2024-03-08',
    adminCount: 1,
    memberCount: 24
  },
  {
    id: '3',
    name: 'Design Collective',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    planId: 'enterprise',
    planName: 'Enterprise',
    status: 'suspended',
    createdAt: '2024-02-15',
    adminCount: 4,
    memberCount: 890
  }]
  );
  const handleStatusChange = (
  id: string,
  newStatus: 'active' | 'suspended') =>
  {
    setOrganizations((orgs) =>
    orgs.map((org) =>
    org.id === id ?
    {
      ...org,
      status: newStatus
    } :
    org
    )
    );
    addToast(
      `Organization ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`,
      'success'
    );
  };
  const handleDelete = (id: string) => {
    if (
    window.confirm(
      'Are you sure you want to delete this organization? This action cannot be undone.'
    ))
    {
      setOrganizations((orgs) => orgs.filter((org) => org.id !== id));
      addToast('Organization deleted', 'success');
    }
  };
  const filteredOrgs = organizations.filter((org) =>
  org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500">
            Manage all organizations on the platform.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}>

          New Organization
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Plan</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Members</TableHeader>
                <TableHeader>Admins</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrgs.map((org) =>
              <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                        {org.name.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-900">
                        {org.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{org.planName}</TableCell>
                  <TableCell>
                    <Badge
                    variant={
                    org.status === 'active' ?
                    'success' :
                    org.status === 'trial' ?
                    'info' :
                    'danger'
                    }>

                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.memberCount}</TableCell>
                  <TableCell>{org.adminCount}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
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
                      label: 'View Details',
                      href: `/super-admin/organizations/${org.id}`,
                      icon: <Building2 className="w-4 h-4" />
                    },
                    {
                      label:
                      org.status === 'suspended' ? 'Activate' : 'Suspend',
                      onClick: () =>
                      handleStatusChange(
                        org.id,
                        org.status === 'suspended' ?
                        'active' :
                        'suspended'
                      ),
                      icon:
                      org.status === 'suspended' ?
                      <CheckCircle className="w-4 h-4" /> :

                      <Ban className="w-4 h-4" />

                    },
                    {
                      label: 'Delete',
                      danger: true,
                      onClick: () => handleDelete(org.id),
                      icon: <Trash2 className="w-4 h-4" />
                    }]
                    } />

                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Organization"
        footer={
        <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addToast('Organization created successfully', 'success');
              setIsCreateModalOpen(false);
            }}>

              Create Organization
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Corp Community" />

          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@example.com" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]">
              <option value="starter">Starter (R29/mo)</option>
              <option value="pro">Pro (R99/mo)</option>
              <option value="enterprise">Enterprise (Custom)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>);

}
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, MoreHorizontal, Copy, Eye } from 'lucide-react';
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
import { Form } from '../../types';
export function FormsPage() {
  // Mock Data
  const forms: Form[] = [
  {
    id: '1',
    title: 'Event Feedback Survey',
    description: 'Feedback for the Annual Gala',
    fields: [],
    createdAt: '2024-03-01',
    isActive: true,
    responseCount: 45
  },
  {
    id: '2',
    title: 'Volunteer Application',
    description: 'Sign up to volunteer',
    fields: [],
    createdAt: '2024-02-15',
    isActive: true,
    responseCount: 12
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-500">
            Create surveys, applications, and feedback forms.
          </p>
        </div>
        <Link to="/admin/forms/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create Form</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Form Title</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Responses</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) =>
            <TableRow key={form.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center text-purple-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {form.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {form.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(form.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={form.isActive ? 'success' : 'secondary'}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                  to={`/admin/forms/${form.id}/responses`}
                  className="text-[var(--color-primary)] hover:underline font-medium">

                    {form.responseCount} responses
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" title="View Responses">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>);

}
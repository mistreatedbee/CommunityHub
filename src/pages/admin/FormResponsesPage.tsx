import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell } from
'../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';
export function FormResponsesPage() {
  const { id } = useParams();
  const { addToast } = useToast();
  const handleExport = () => {
    addToast('Export started. You will receive an email shortly.', 'success');
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/forms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Form Responses</h1>
            <p className="text-gray-500">Event Feedback Survey</p>
          </div>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExport}>

          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-gray-900">45</div>
          <div className="text-sm text-gray-500">Total Responses</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-gray-900">92%</div>
          <div className="text-sm text-gray-500">Completion Rate</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-gray-900">2m</div>
          <div className="text-sm text-gray-500">Avg. Time to Complete</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Submitted At</TableHeader>
              <TableHeader>Respondent</TableHeader>
              <TableHeader>Q1: Satisfaction</TableHeader>
              <TableHeader>Q2: Comments</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) =>
            <TableRow key={i}>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>User {i}</TableCell>
                <TableCell>Very Satisfied</TableCell>
                <TableCell className="truncate max-w-xs">
                  Great event, loved the speakers!
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>);

}
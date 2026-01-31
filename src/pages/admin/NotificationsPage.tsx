import React, { useState } from 'react';
import { Send, Bell, Users, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
export function NotificationsPage() {
  const { addToast } = useToast();
  const [target, setTarget] = useState('all');
  const handleSend = () => {
    addToast('Notification sent successfully', 'success');
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500">
          Send push notifications and emails to your members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900">
                Compose Notification
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Title" placeholder="Notification title" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  rows={4}
                  placeholder="Type your message here..." />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTarget('all')}
                    className={`p-3 rounded-lg border text-center transition-colors ${target === 'all' ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-gray-200 hover:bg-gray-50'}`}>

                    <Users className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">All Members</div>
                  </button>
                  <button
                    onClick={() => setTarget('group')}
                    className={`p-3 rounded-lg border text-center transition-colors ${target === 'group' ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-gray-200 hover:bg-gray-50'}`}>

                    <Users className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Specific Group</div>
                  </button>
                  <button
                    onClick={() => setTarget('individual')}
                    className={`p-3 rounded-lg border text-center transition-colors ${target === 'individual' ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-gray-200 hover:bg-gray-50'}`}>

                    <Users className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Individual</div>
                  </button>
                </div>
              </div>

              {target === 'group' &&
              <Input label="Select Group" placeholder="Search groups..." />
              }
              {target === 'individual' &&
              <Input label="Select Member" placeholder="Search members..." />
              }

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSend}
                  leftIcon={<Send className="w-4 h-4" />}>

                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & History */}
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4">
              Preview
            </h4>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  Notification Title
                </div>
                <div className="text-xs text-gray-500 mb-1">Just now</div>
                <div className="text-sm text-gray-600">
                  This is how your notification will appear to members.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-900">
            Recent Notifications
          </h3>
        </CardHeader>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Title</TableHeader>
              <TableHeader>Target</TableHeader>
              <TableHeader>Sent Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Event Reminder: Town Hall
              </TableCell>
              <TableCell>All Members</TableCell>
              <TableCell>Mar 10, 2024</TableCell>
              <TableCell>
                <Badge variant="success">Sent</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Group Update</TableCell>
              <TableCell>Design Team</TableCell>
              <TableCell>Mar 08, 2024</TableCell>
              <TableCell>
                <Badge variant="success">Sent</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>);

}
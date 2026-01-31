import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock } from
'lucide-react';
import { StatsCard } from '../../components/widgets/StatsCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Application } from '../../types';
export function AdminDashboardPage() {
  // Mock Data
  const pendingApplications: Application[] = [
  {
    id: '1',
    userId: 'temp1',
    applicantName: 'Sarah Connor',
    applicantEmail: 'sarah@example.com',
    status: 'pending',
    submittedAt: '2024-03-10T10:00:00Z',
    personalInfo: {},
    contactInfo: {},
    background: {}
  },
  {
    id: '2',
    userId: 'temp2',
    applicantName: 'Kyle Reese',
    applicantEmail: 'kyle@example.com',
    status: 'pending',
    submittedAt: '2024-03-09T15:30:00Z',
    personalInfo: {},
    contactInfo: {},
    background: {}
  },
  {
    id: '3',
    userId: 'temp3',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    status: 'info_requested',
    submittedAt: '2024-03-08T09:15:00Z',
    personalInfo: {},
    contactInfo: {},
    background: {}
  }];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Overview of your community's health and activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/announcements/new">
            <Button variant="outline">New Announcement</Button>
          </Link>
          <Link to="/admin/events/new">
            <Button>Create Event</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Members"
          value="1,248"
          trend={{
            value: '5%',
            isPositive: true
          }}
          icon={Users}
          color="blue" />

        <StatsCard
          label="Pending Applications"
          value="12"
          icon={FileText}
          color="orange" />

        <StatsCard
          label="Event Attendance"
          value="85%"
          trend={{
            value: '2%',
            isPositive: true
          }}
          icon={Calendar}
          color="green" />

        <StatsCard
          label="Engagement Rate"
          value="64%"
          trend={{
            value: '1%',
            isPositive: false
          }}
          icon={TrendingUp}
          color="purple" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Applications */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              Pending Applications
            </h3>
            <Link to="/admin/applications">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Applicant</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApplications.map((app) =>
                <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {app.applicantName}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {app.applicantEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                      variant={
                      app.status === 'info_requested' ? 'warning' : 'info'
                      }>

                        {app.status === 'info_requested' ?
                      'Info Requested' :
                      'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/applications/${app.id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent Activity / System Health */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">System Status</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    All Systems Operational
                  </h4>
                  <p className="text-sm text-gray-500">
                    Website, API, and Database are running smoothly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Last Backup</h4>
                  <p className="text-sm text-gray-500">
                    Completed successfully 2 hours ago.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Storage Usage</h4>
                  <p className="text-sm text-gray-500">
                    You have used 75% of your allocated media storage.
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: '75%'
                      }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}
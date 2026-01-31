import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus } from
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
import { OrganizationWithPlan } from '../../types';
export function SuperAdminDashboardPage() {
  // Mock Data
  const recentOrgs: OrganizationWithPlan[] = [
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
    status: 'active',
    createdAt: '2024-03-05',
    adminCount: 4,
    memberCount: 890
  }];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Platform Overview
          </h1>
          <p className="text-gray-500">
            Super Admin dashboard for system-wide management.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/super-admin/organizations">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              New Organization
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Organizations"
          value="142"
          trend={{
            value: '12 new',
            isPositive: true
          }}
          icon={Building2}
          color="blue" />

        <StatsCard
          label="Total Users"
          value="15.4k"
          trend={{
            value: '8% growth',
            isPositive: true
          }}
          icon={Users}
          color="purple" />

        <StatsCard
          label="Active Subscriptions"
          value="118"
          trend={{
            value: '92% retention',
            isPositive: true
          }}
          icon={CreditCard}
          color="green" />

        <StatsCard
          label="Monthly Revenue"
          value="R42.5k"
          trend={{
            value: '15% vs last mo',
            isPositive: true
          }}
          icon={TrendingUp}
          color="orange" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Organizations */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              Recent Organizations
            </h3>
            <Link to="/super-admin/organizations">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Organization</TableHeader>
                  <TableHeader>Plan</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Created</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrgs.map((org) =>
                <TableRow key={org.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {org.name}
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

                        {org.status.charAt(0).toUpperCase() +
                      org.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">API Performance</h4>
                  <p className="text-sm text-gray-500">
                    99.9% uptime. Average latency 45ms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Database Load</h4>
                  <p className="text-sm text-gray-500">
                    Spike detected at 02:00 UTC. Currently stable at 45%
                    capacity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Concurrent Users
                  </h4>
                  <p className="text-sm text-gray-500">
                    Current peak: 1,240 active sessions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}
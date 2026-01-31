import React from 'react';
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Download } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/widgets/StatsCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">
            Insights into your community growth and engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Members"
          value="1,248"
          trend={{
            value: '12%',
            isPositive: true
          }}
          icon={Users}
          color="blue" />

        <StatsCard
          label="Active Users"
          value="856"
          trend={{
            value: '5%',
            isPositive: true
          }}
          icon={TrendingUp}
          color="green" />

        <StatsCard
          label="Event Attendees"
          value="342"
          trend={{
            value: '8%',
            isPositive: true
          }}
          icon={Calendar}
          color="purple" />

        <StatsCard
          label="Discussions"
          value="1,892"
          trend={{
            value: '15%',
            isPositive: true
          }}
          icon={MessageSquare}
          color="orange" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">Member Growth</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 55, 45, 60, 75, 65, 85, 90, 100, 110, 105, 120].map(
                (h, i) =>
                <div
                  key={i}
                  className="w-full bg-blue-100 rounded-t-sm relative group">

                    <div
                    className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${h}%`
                    }}>
                  </div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none">
                      {h * 10}
                    </div>
                  </div>

              )}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">
              Engagement by Type
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
              {
                label: 'Event Participation',
                val: 75,
                color: 'bg-blue-500'
              },
              {
                label: 'Discussion Posts',
                val: 60,
                color: 'bg-green-500'
              },
              {
                label: 'Direct Messages',
                val: 45,
                color: 'bg-purple-500'
              },
              {
                label: 'Resource Downloads',
                val: 30,
                color: 'bg-orange-500'
              }].
              map((item) =>
              <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-gray-500">{item.val}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                    className={`h-2.5 rounded-full ${item.color}`}
                    style={{
                      width: `${item.val}%`
                    }}>
                  </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}
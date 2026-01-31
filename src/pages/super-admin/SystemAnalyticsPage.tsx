import React from 'react';
import { TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import { StatsCard } from '../../components/widgets/StatsCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
export function SystemAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-500">
            Platform-wide performance metrics and growth stats.
          </p>
        </div>
        <select className="rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Revenue"
          value="R512,450"
          trend={{
            value: '18% vs last period',
            isPositive: true
          }}
          icon={DollarSign}
          color="green" />

        <StatsCard
          label="MRR"
          value="R42,500"
          trend={{
            value: '5% vs last month',
            isPositive: true
          }}
          icon={TrendingUp}
          color="blue" />

        <StatsCard
          label="Active Orgs"
          value="142"
          trend={{
            value: '12 new',
            isPositive: true
          }}
          icon={Building2}
          color="purple" />

        <StatsCard
          label="Total Users"
          value="15,420"
          trend={{
            value: '8% growth',
            isPositive: true
          }}
          icon={Users}
          color="orange" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart Placeholder */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">
              Organization Growth
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {[35, 42, 48, 55, 62, 75, 88, 95, 110, 125, 132, 142].map(
                (val, i) =>
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group">

                    <div
                    className="w-full bg-blue-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{
                      height: `${val / 150 * 100}%`
                    }} />

                    <span className="text-xs text-gray-500 mt-2">
                      {
                    [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'][
                    i]
                    }
                    </span>
                  </div>

              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">Revenue by Plan</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
              {
                label: 'Enterprise',
                value: 65,
                amount: 'R27,625',
                color: 'bg-purple-500'
              },
              {
                label: 'Pro',
                value: 25,
                amount: 'R10,625',
                color: 'bg-blue-500'
              },
              {
                label: 'Starter',
                value: 10,
                amount: 'R4,250',
                color: 'bg-green-500'
              }].
              map((item) =>
              <div key={item.label}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="font-bold text-gray-900">
                      {item.amount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                    className={`h-3 rounded-full ${item.color}`}
                    style={{
                      width: `${item.value}%`
                    }} />

                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.value}% of total revenue
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}
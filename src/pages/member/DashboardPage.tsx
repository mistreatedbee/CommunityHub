import React from 'react';
import {
  Calendar,
  Megaphone,
  Users,
  MessageSquare,
  ArrowRight } from
'lucide-react';
import { StatsCard } from '../../components/widgets/StatsCard';
import { EventCard } from '../../components/widgets/EventCard';
import { AnnouncementCard } from '../../components/widgets/AnnouncementCard';
import { Button } from '../../components/ui/Button';
import { Event, Announcement } from '../../types';
export function DashboardPage() {
  // Mock Data
  const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Community Town Hall',
    description: 'Join us for our monthly town hall meeting.',
    date: '2024-03-15',
    time: '18:00',
    location: 'Main Hall & Online',
    isOnline: true,
    attendees: 45,
    category: 'meeting',
    imageUrl:
    'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Spring Networking Mixer',
    description: 'Meet other members and grow your network.',
    date: '2024-03-20',
    time: '19:00',
    location: 'The Social Hub',
    isOnline: false,
    attendees: 82,
    category: 'social',
    imageUrl:
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Community Guidelines',
    content:
    'We have updated our community guidelines to ensure a safe and welcoming environment for everyone.',
    date: '2024-03-01',
    isPinned: true,
    author: 'Admin Team',
    category: 'urgent',
    visibility: 'public'
  }];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Alex! Here's what's happening today.
          </p>
        </div>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Upcoming Events"
          value="3"
          icon={Calendar}
          color="blue" />

        <StatsCard
          label="New Announcements"
          value="5"
          icon={Megaphone}
          color="orange" />

        <StatsCard
          label="Active Groups"
          value="12"
          trend={{
            value: '12%',
            isPositive: true
          }}
          icon={Users}
          color="green" />

        <StatsCard
          label="Unread Messages"
          value="2"
          icon={MessageSquare}
          color="purple" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Events Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Your Upcoming Events
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--color-primary)]">

                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) =>
              <EventCard key={event.id} event={event} compact />
              )}
            </div>
          </section>

          {/* Recent Activity / Feed could go here */}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Announcements Widget */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) =>
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement} />

              )}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Have feedback?
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  We'd love to hear your thoughts on the new platform.
                </p>
                <Button size="sm" variant="secondary" className="w-full">
                  Submit Feedback
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

}
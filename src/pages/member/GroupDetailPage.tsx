import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  Bell,
  MoreHorizontal } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs } from '../../components/ui/Tabs';
import { AnnouncementCard } from '../../components/widgets/AnnouncementCard';
import { EventCard } from '../../components/widgets/EventCard';
import { Group, Announcement, Event } from '../../types';
export function GroupDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  // Mock Data
  const group: Group = {
    id: id || '1',
    name: 'Product Designers',
    description:
    'A space for product designers to share resources, ask for feedback, and discuss trends in UX/UI, research, and design systems.',
    memberCount: 142,
    isPrivate: false,
    imageUrl:
    'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  };
  const announcements: Announcement[] = [
  {
    id: 'g1',
    title: 'Design Critique Session Next Week',
    content:
    'We will be hosting a design critique session next Tuesday. Bring your work in progress!',
    date: '2024-03-08',
    isPinned: true,
    author: 'Group Admin',
    category: 'general',
    visibility: 'members'
  }];

  const events: Event[] = [
  {
    id: 'e1',
    title: 'Monthly Design Meetup',
    description: 'Casual hangout for designers.',
    date: '2024-03-20',
    time: '18:00',
    location: 'Online',
    isOnline: true,
    attendees: 24,
    category: 'social'
  }];

  const FeedTab = () =>
  <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <Avatar alt="Me" />
          <div className="flex-1">
            <textarea
            className="w-full border-none resize-none focus:ring-0 text-gray-700 text-lg"
            placeholder="Start a discussion..."
            rows={2} />

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button size="sm">Post</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-gray-900">Announcements</h3>
        {announcements.map((a) =>
      <AnnouncementCard key={a.id} announcement={a} />
      )}
      </div>
    </div>;

  const EventsTab = () =>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((e) =>
    <EventCard key={e.id} event={e} />
    )}
    </div>;

  const MembersTab = () =>
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">
          Members ({group.memberCount})
        </h3>
        <input
        type="text"
        placeholder="Search members..."
        className="px-3 py-1.5 rounded-md border border-gray-300 text-sm" />

      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((i) =>
      <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar alt={`Member ${i}`} />
              <div>
                <p className="font-medium text-gray-900">Member Name {i}</p>
                <p className="text-xs text-gray-500">Joined 2 months ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Message
            </Button>
          </div>
      )}
      </div>
    </div>;

  return (
    <div className="space-y-8">
      <Link
        to="/dashboard/groups"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">

        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Groups
      </Link>

      {/* Group Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-48 w-full relative">
          <img
            src={group.imageUrl}
            alt={group.name}
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                {group.isPrivate ?
                <Lock className="w-4 h-4" /> :

                <Globe className="w-4 h-4" />
                }
                {group.isPrivate ? 'Private Group' : 'Public Group'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {group.memberCount} members
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-gray-600 max-w-2xl">{group.description}</p>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Bell className="w-4 h-4" />}>
              Notifications
            </Button>
            <Button variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-6">
          <Tabs
            tabs={[
            {
              id: 'feed',
              label: 'Feed',
              content:
              <div className="py-6">
                    <FeedTab />
                  </div>

            },
            {
              id: 'events',
              label: 'Events',
              content:
              <div className="py-6">
                    <EventsTab />
                  </div>

            },
            {
              id: 'members',
              label: 'Members',
              content:
              <div className="py-6">
                    <MembersTab />
                  </div>

            },
            {
              id: 'resources',
              label: 'Resources',
              content:
              <div className="py-6 text-gray-500 text-center">
                    No resources yet.
                  </div>

            }]
            } />

        </div>
      </div>
    </div>);

}
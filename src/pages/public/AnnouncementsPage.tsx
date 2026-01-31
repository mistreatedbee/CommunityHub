import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Pin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnnouncementCard } from '../../components/widgets/AnnouncementCard';
import { Announcement } from '../../types';
export function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  // Mock Data
  const announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Community Guidelines',
    content:
    'We have updated our community guidelines to ensure a safe and welcoming environment for everyone. Please review the changes carefully as they affect all members starting next month.',
    date: '2024-03-01',
    isPinned: true,
    author: 'Admin Team',
    category: 'urgent',
    visibility: 'public'
  },
  {
    id: '2',
    title: 'Platform Maintenance Scheduled',
    content:
    'The platform will be undergoing scheduled maintenance on Sunday, March 10th from 2:00 AM to 4:00 AM UTC. During this time, access may be intermittent.',
    date: '2024-03-05',
    isPinned: true,
    author: 'Tech Support',
    category: 'urgent',
    visibility: 'public'
  },
  {
    id: '3',
    title: 'Welcome to our new platform!',
    content:
    'We are excited to launch our new community hub. Explore the new features, connect with other members, and let us know what you think in the feedback section.',
    date: '2024-02-28',
    isPinned: false,
    author: 'Community Manager',
    category: 'general',
    visibility: 'public'
  },
  {
    id: '4',
    title: 'Monthly Newsletter - February',
    content:
    'Check out what happened in our community this past month. We have highlighted top contributors, successful events, and shared plans for the upcoming season.',
    date: '2024-02-25',
    isPinned: false,
    author: 'Editorial Team',
    category: 'news',
    visibility: 'public'
  },
  {
    id: '5',
    title: 'Call for Volunteers: Spring Festival',
    content:
    'We are looking for enthusiastic volunteers to help organize our annual Spring Festival. Roles include event planning, decoration, and guest management.',
    date: '2024-02-20',
    isPinned: false,
    author: 'Events Committee',
    category: 'general',
    visibility: 'public'
  },
  {
    id: '6',
    title: 'New Feature: Direct Messaging',
    content:
    'You can now send direct messages to other members! Go to your profile settings to configure your privacy preferences for this new feature.',
    date: '2024-02-15',
    isPinned: false,
    author: 'Product Team',
    category: 'news',
    visibility: 'public'
  }];

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
    categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1">
            Stay updated with the latest news and important information.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}>

            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="urgent">Urgent</option>
            <option value="news">News</option>
          </select>
        </div>
      </div>

      {pinnedAnnouncements.length > 0 &&
      <div className="mb-12">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <Pin className="w-4 h-4 mr-2 text-[var(--color-primary)]" />
            Pinned Announcements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedAnnouncements.map((announcement) =>
          <Link
            key={announcement.id}
            to={`/announcements/${announcement.id}`}
            className="block h-full">

                <AnnouncementCard announcement={announcement} />
              </Link>
          )}
          </div>
        </div>
      }

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Updates
        </h2>
        {regularAnnouncements.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularAnnouncements.map((announcement) =>
          <Link
            key={announcement.id}
            to={`/announcements/${announcement.id}`}
            className="block h-full">

                <AnnouncementCard announcement={announcement} />
              </Link>
          )}
          </div> :

        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">
              No announcements found matching your criteria.
            </p>
            <Button
            variant="ghost"
            className="mt-2 text-[var(--color-primary)]"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}>

              Clear filters
            </Button>
          </div>
        }
      </div>
    </div>);

}
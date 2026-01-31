import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Clock,
  Filter } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
interface Discussion {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  replies: number;
  likes: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
}
export function DiscussionsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  // Mock Data
  const discussions: Discussion[] = [
  {
    id: '1',
    title: 'Welcome to the new community platform!',
    preview:
    'Hi everyone! We are so excited to launch this new space for us to connect. Please introduce yourself in this thread and let us know what you are working on.',
    author: {
      name: 'Community Admin'
    },
    category: 'Announcements',
    replies: 45,
    likes: 120,
    views: 540,
    lastActivity: '2 hours ago',
    isPinned: true
  },
  {
    id: '2',
    title: 'Best practices for remote team management',
    preview:
    'I have been struggling with keeping my team engaged while working remotely. What tools or rituals do you use to maintain culture?',
    author: {
      name: 'Sarah Jenkins'
    },
    category: 'General',
    replies: 12,
    likes: 8,
    views: 156,
    lastActivity: '5 hours ago'
  },
  {
    id: '3',
    title: 'Looking for feedback on my new project',
    preview:
    'I just launched a beta version of my sustainability app. Would love to get some eyes on it from this group.',
    author: {
      name: 'David Chen'
    },
    category: 'Showcase',
    replies: 5,
    likes: 15,
    views: 89,
    lastActivity: '1 day ago'
  },
  {
    id: '4',
    title: 'Upcoming local meetup in San Francisco',
    preview:
    'Is anyone planning to attend the tech mixer next Tuesday? Maybe we can grab coffee beforehand.',
    author: {
      name: 'Alex Rivera'
    },
    category: 'Events',
    replies: 8,
    likes: 4,
    views: 112,
    lastActivity: '2 days ago'
  }];

  const categories = [
  'All',
  'General',
  'Announcements',
  'Showcase',
  'Events',
  'Help'];

  const filteredDiscussions =
  activeCategory === 'All' ?
  discussions :
  discussions.filter((d) => d.category === activeCategory);
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-500">
            Join the conversation and connect with other members.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>New Discussion</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm" />

          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) =>
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${activeCategory === category ? 'bg-blue-50 text-[var(--color-primary)]' : 'text-gray-600 hover:bg-gray-50'}`}>

                  {category}
                  {category === 'All' &&
                <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full">
                      {discussions.length}
                    </span>
                }
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Discussion List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort Bar */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span className="font-medium">Sort by:</span>
            <button
              className={`hover:text-gray-900 ${sortBy === 'latest' ? 'text-[var(--color-primary)] font-bold' : ''}`}
              onClick={() => setSortBy('latest')}>

              Latest
            </button>
            <button
              className={`hover:text-gray-900 ${sortBy === 'top' ? 'text-[var(--color-primary)] font-bold' : ''}`}
              onClick={() => setSortBy('top')}>

              Top
            </button>
            <button
              className={`hover:text-gray-900 ${sortBy === 'active' ? 'text-[var(--color-primary)] font-bold' : ''}`}
              onClick={() => setSortBy('active')}>

              Active
            </button>
          </div>

          {filteredDiscussions.map((discussion) =>
          <Link
            key={discussion.id}
            to={`/dashboard/discussions/${discussion.id}`}
            className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <Avatar alt={discussion.author.name} size="md" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {discussion.isPinned &&
                  <Badge
                    variant="info"
                    className="py-0.5 px-1.5 text-[10px]">

                        Pinned
                      </Badge>
                  }
                    <Badge
                    variant="outline"
                    className="py-0.5 px-1.5 text-[10px]">

                      {discussion.category}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />{' '}
                      {discussion.lastActivity}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {discussion.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {discussion.preview}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      {discussion.replies} replies
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4" />
                      {discussion.likes} likes
                    </span>
                    <span className="text-xs">
                      Posted by{' '}
                      <span className="font-medium text-gray-700">
                        {discussion.author.name}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>);

}
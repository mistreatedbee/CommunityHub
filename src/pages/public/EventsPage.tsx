import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EventCard } from '../../components/widgets/EventCard';
import { Event } from '../../types';
export function EventsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  // Mock Data
  const events: Event[] = [
  {
    id: '1',
    title: 'Community Town Hall',
    description:
    'Join us for our monthly town hall meeting to discuss upcoming initiatives and community matters.',
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
    description:
    'Meet other members and grow your network in a relaxed, casual environment.',
    date: '2024-03-20',
    time: '19:00',
    location: 'The Social Hub',
    isOnline: false,
    attendees: 82,
    category: 'social',
    imageUrl:
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Leadership Workshop',
    description:
    'Develop your leadership skills with expert coaches in this intensive half-day workshop.',
    date: '2024-03-25',
    time: '10:00',
    location: 'Conference Room A',
    isOnline: false,
    attendees: 20,
    category: 'workshop',
    imageUrl:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description:
    'Learn the latest strategies for promoting your business online.',
    date: '2024-03-28',
    time: '14:00',
    location: 'Zoom Webinar',
    isOnline: true,
    attendees: 150,
    category: 'workshop',
    imageUrl:
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Volunteer Orientation',
    description:
    'New to volunteering? Come learn how you can make a difference.',
    date: '2024-04-02',
    time: '17:30',
    location: 'Community Center',
    isOnline: false,
    attendees: 12,
    category: 'meeting',
    imageUrl:
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Tech Talk: AI in 2024',
    description:
    'A panel discussion on the future of artificial intelligence.',
    date: '2024-04-10',
    time: '18:30',
    location: 'Innovation Lab',
    isOnline: true,
    attendees: 65,
    category: 'social',
    imageUrl:
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const filteredEvents =
  filter === 'all' ?
  events :
  events.filter(
    (e) =>
    e.category === filter ||
    filter === 'online' && e.isOnline ||
    filter === 'in-person' && !e.isOnline
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upcoming Events
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Browse our calendar of workshops, social gatherings, and community
            meetings. Join us to learn, connect, and grow.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}>

            Grid View
          </Button>
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('list')}>

            List View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm" />

        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'social', 'workshop', 'meeting', 'online', 'in-person'].map(
            (cat) =>
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>

                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>

          )}
        </div>
      </div>

      {/* Events Grid */}
      {view === 'grid' ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) =>
        <div key={event.id} className="h-full">
              <EventCard event={event} />
            </div>
        )}
        </div> :

      <div className="space-y-4">
          {filteredEvents.map((event) =>
        <div
          key={event.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">

              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover" />

              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />{' '}
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {event.location}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}
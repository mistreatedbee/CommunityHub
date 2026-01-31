import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Calendar,
  Megaphone,
  CheckCircle } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { EventCard } from '../../components/widgets/EventCard';
import { AnnouncementCard } from '../../components/widgets/AnnouncementCard';
import { useTheme } from '../../contexts/ThemeContext';
import { Event, Announcement } from '../../types';
export function HomePage() {
  const { organization } = useTheme();
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
  },
  {
    id: '3',
    title: 'Leadership Workshop',
    description: 'Develop your leadership skills with expert coaches.',
    date: '2024-03-25',
    time: '10:00',
    location: 'Conference Room A',
    isOnline: false,
    attendees: 20,
    category: 'workshop',
    imageUrl:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Community Guidelines',
    content:
    'We have updated our community guidelines to ensure a safe and welcoming environment for everyone. Please review the changes.',
    date: '2024-03-01',
    isPinned: true,
    author: 'Admin Team',
    category: 'urgent',
    visibility: 'public'
  },
  {
    id: '2',
    title: 'Welcome to our new platform!',
    content:
    'We are excited to launch our new community hub. Explore the new features and let us know what you think.',
    date: '2024-02-28',
    isPinned: false,
    author: 'Community Manager',
    category: 'general',
    visibility: 'public'
  }];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{' '}
                  <span className="block text-[var(--color-primary)] xl:inline">
                    {organization.name}
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {organization.description} Join our vibrant community to
                  connect, learn, and grow together. We provide the tools and
                  space for meaningful interactions.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Link to="/apply">
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="w-5 h-5" />}>

                      Join Community
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
            alt="Community gathering" />

        </div>
      </section>

      {/* Stats / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">
              Network with like-minded individuals and build lasting
              professional relationships.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Participate
            </h3>
            <p className="text-gray-600">
              Join exclusive events, workshops, and webinars designed for your
              growth.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-purple-50 rounded-2xl">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Stay Informed
            </h3>
            <p className="text-gray-600">
              Get the latest news, resources, and opportunities delivered
              directly to you.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <p className="mt-2 text-gray-600">
                Don't miss out on what's happening next.
              </p>
            </div>
            <Link to="/events">
              <Button
                variant="ghost"
                rightIcon={<ArrowRight className="w-4 h-4" />}>

                View all events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) =>
            <EventCard key={event.id} event={event} />
            )}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Latest Updates
            </h2>
            <div className="space-y-6">
              {announcements.map((announcement) =>
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement} />

              )}
            </div>
            <div className="mt-8">
              <Link to="/announcements">
                <Button variant="outline">View all announcements</Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Team working"
              className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Join our growing community
                </h3>
                <p className="text-gray-200">
                  Be part of something bigger. Connect, share, and succeed
                  together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--color-primary)] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of members who are already part of our community.
            Apply today and get instant access to all resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button
                size="lg"
                className="bg-white text-[var(--color-primary)] hover:bg-gray-100 w-full sm:w-auto">

                Apply for Membership
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto">

                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);

}
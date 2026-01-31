import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  CheckCircle } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Event } from '../../types';
export function EventDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  // Mock Data
  const event: Event = {
    id: id || '1',
    title: 'Community Town Hall',
    description:
    'Join us for our monthly town hall meeting to discuss upcoming initiatives and community matters. This is your chance to voice your opinions, ask questions to the leadership team, and connect with fellow members.',
    date: '2024-03-15',
    time: '18:00 - 20:00',
    location: 'Main Hall & Online',
    isOnline: true,
    meetingLink: 'https://zoom.us/j/123456789',
    attendees: 45,
    category: 'meeting',
    imageUrl:
    'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Image */}
      <div className="h-[300px] w-full relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-8 left-0 w-full px-4 sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">

            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={event.isOnline ? 'info' : 'success'}>
                  {event.isOnline ? 'Online Event' : 'In Person'}
                </Badge>
                <Badge variant="outline">{event.category}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {event.title}
              </h1>

              <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100 mb-8">
                <div className="flex items-center text-gray-600">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--color-primary)] mr-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      Date
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--color-primary)] mr-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      Time
                    </p>
                    <p className="font-semibold text-gray-900">{event.time}</p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  About this Event
                </h3>
                <p>{event.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Agenda</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="font-mono text-sm font-bold text-[var(--color-primary)]">
                      18:00
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Welcome & Introduction
                      </p>
                      <p className="text-sm text-gray-500">
                        Opening remarks by the Community Manager
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-sm font-bold text-[var(--color-primary)]">
                      18:30
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Keynote Presentation
                      </p>
                      <p className="text-sm text-gray-500">
                        Future of our community platform
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-sm font-bold text-[var(--color-primary)]">
                      19:30
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Q&A Session</p>
                      <p className="text-sm text-gray-500">
                        Open floor for member questions
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Registration
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    {event.isOnline &&
                    <p className="text-xs text-[var(--color-primary)] mt-1">
                        Link will be provided after registration
                      </p>
                    }
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Attendees</p>
                    <p className="text-sm text-gray-500">
                      {event.attendees} people going
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full mb-3">
                Register Now
              </Button>
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<Share2 className="w-4 h-4" />}>

                Share Event
              </Button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Registration closes 2 hours before the event starts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
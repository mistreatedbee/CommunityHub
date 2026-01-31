import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Copy } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Event } from '../../types';
export function AdminEventsPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const [events, setEvents] = useState<Event[]>([
  {
    id: '1',
    title: 'Community Town Hall',
    description: 'Monthly town hall...',
    date: '2024-03-15',
    time: '18:00',
    location: 'Main Hall & Online',
    isOnline: true,
    attendees: 45,
    category: 'meeting'
  },
  {
    id: '2',
    title: 'Spring Networking Mixer',
    description: 'Networking event...',
    date: '2024-03-20',
    time: '19:00',
    location: 'The Social Hub',
    isOnline: false,
    attendees: 82,
    category: 'social'
  }]
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500">Manage upcoming and past events.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}>

          Create Event
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white text-sm">
              <option value="all">All Categories</option>
              <option value="social">Social</option>
              <option value="workshop">Workshop</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Event</TableHeader>
              <TableHeader>Date & Time</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Attendees</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) =>
            <TableRow key={event.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {event.category}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span className="text-gray-500">{event.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="w-3 h-3 text-gray-400" />
                    {event.attendees}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.isOnline ? 'info' : 'secondary'}>
                    {event.isOnline ? 'Online' : 'In Person'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50">

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Event"
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addToast('Event created', 'success');
              setIsModalOpen(false);
            }}>

              Create Event
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Event Title" placeholder="e.g. Annual Gala" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white">
                <option value="social">Social</option>
                <option value="workshop">Workshop</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

                <span className="text-sm text-gray-700">
                  This is an online event
                </span>
              </label>
            </div>
          </div>

          <Input
            label="Location / Meeting Link"
            placeholder="e.g. 123 Main St or Zoom Link" />


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={3}
              placeholder="Event details..." />

          </div>

          <Input label="Cover Image URL" placeholder="https://..." />
        </div>
      </Modal>
    </div>);

}
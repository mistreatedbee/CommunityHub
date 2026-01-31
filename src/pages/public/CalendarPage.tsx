import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Event } from '../../types';
export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const events: Event[] = [
  {
    id: '1',
    title: 'Community Town Hall',
    description: 'Join us for our monthly town hall meeting.',
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
    description: 'Meet other members and grow your network.',
    date: '2024-03-20',
    time: '19:00',
    location: 'The Social Hub',
    isOnline: false,
    attendees: 82,
    category: 'social'
  },
  {
    id: '3',
    title: 'Leadership Workshop',
    description: 'Develop your leadership skills.',
    date: '2024-03-25',
    time: '10:00',
    location: 'Conference Room A',
    isOnline: false,
    attendees: 20,
    category: 'workshop'
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description: 'Learn the latest strategies.',
    date: '2024-03-28',
    time: '14:00',
    location: 'Zoom Webinar',
    isOnline: true,
    attendees: 150,
    category: 'workshop'
  }];

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 md:h-32 bg-gray-50 border border-gray-100">
        </div>
      );
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter((e) => e.date === dateStr);
      const isToday =
      new Date().toDateString() ===
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).toDateString();
      days.push(
        <div
          key={day}
          className={`h-24 md:h-32 border border-gray-100 p-2 relative hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>

          <div
            className={`text-sm font-medium mb-1 ${isToday ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>

            {isToday ?
            <span className="bg-[var(--color-primary)] text-white w-6 h-6 rounded-full flex items-center justify-center">
                {day}
              </span> :

            day
            }
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
            {dayEvents.map((event) =>
            <button
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`w-full text-left text-xs px-2 py-1 rounded truncate ${event.category === 'meeting' ? 'bg-blue-100 text-blue-800' : event.category === 'social' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>

                {event.time.split(' ')[0]} {event.title}
              </button>
            )}
          </div>
        </div>
      );
    }
    return days;
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Community Calendar</h1>
        <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold min-w-[140px] text-center">
            {currentDate.toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">

              {day}
            </div>
          )}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">{renderCalendarDays()}</div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Meeting
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Social
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
          Workshop
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.title || 'Event Details'}
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button>Register Now</Button>
          </div>
        }>

        {selectedEvent &&
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={selectedEvent.isOnline ? 'info' : 'success'}>
                {selectedEvent.isOnline ? 'Online' : 'In Person'}
              </Badge>
              <Badge variant="outline">{selectedEvent.category}</Badge>
            </div>

            <p className="text-gray-600">{selectedEvent.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <CalendarIcon className="w-4 h-4 mr-3 text-gray-400" />
                {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-3 text-gray-400" />
                {selectedEvent.time}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                {selectedEvent.location}
              </div>
            </div>
          </div>
        }
      </Modal>
    </div>);

}
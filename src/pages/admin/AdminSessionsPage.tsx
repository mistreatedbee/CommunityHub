import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Video,
  PlayCircle,
  Users } from
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
import { Session } from '../../types';
export function AdminSessionsPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const [sessions, setSessions] = useState<Session[]>([
  {
    id: '1',
    title: 'Weekly Q&A',
    description: 'Open floor for questions',
    date: '2024-03-12',
    time: '14:00',
    duration: 60,
    meetingLink: 'https://zoom.us/j/123456',
    hostId: 'admin1',
    isRecorded: true,
    recordingUrl: 'https://...',
    attendees: 12,
    accessLevel: 'members'
  }]
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Sessions</h1>
          <p className="text-gray-500">Manage virtual meetups and webinars.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}>

          Schedule Session
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Session</TableHeader>
              <TableHeader>Schedule</TableHeader>
              <TableHeader>Access</TableHeader>
              <TableHeader>Recording</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) =>
            <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.duration} mins
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(session.date).toLocaleDateString()}</div>
                    <div className="text-gray-500">{session.time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {session.accessLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  {session.recordingUrl ?
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <PlayCircle className="w-3 h-3" /> Available
                    </div> :

                <span className="text-xs text-gray-400">Not available</span>
                }
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
        title="Schedule Session"
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addToast('Session scheduled', 'success');
              setIsModalOpen(false);
            }}>

              Schedule
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Title" placeholder="Session topic" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
            <Input label="Duration (min)" type="number" defaultValue="60" />
          </div>
          <Input label="Meeting Link" placeholder="https://zoom.us/..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white">
              <option value="all">Public</option>
              <option value="members">Members Only</option>
              <option value="leaders">Leaders Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="record"
              className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

            <label htmlFor="record" className="text-sm text-gray-700">
              Automatically record this session
            </label>
          </div>
        </div>
      </Modal>
    </div>);

}
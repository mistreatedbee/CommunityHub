import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  X,
  MessageSquare,
  User,
  Mail,
  Briefcase,
  MapPin } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Application } from '../../types';
export function ApplicationReviewPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [note, setNote] = useState('');
  // Mock Data
  const application: Application = {
    id: id || '1',
    userId: 'temp1',
    applicantName: 'Sarah Connor',
    applicantEmail: 'sarah@example.com',
    status: 'pending',
    submittedAt: '2024-03-10T10:00:00Z',
    personalInfo: {
      occupation: 'Software Engineer',
      company: 'Tech Corp',
      linkedin: 'linkedin.com/in/sarahconnor',
      website: 'sarah.dev'
    },
    contactInfo: {
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, CA'
    },
    background: {
      bio: 'I am a software engineer with 5 years of experience. I am passionate about open source and community building. I want to join this community to learn from others and share my knowledge.',
      interests: ['React', 'TypeScript', 'AI', 'Community Management'],
      referral: 'Found via Twitter'
    }
  };
  const handleApprove = () => {
    setIsApproveModalOpen(false);
    addToast('Application approved successfully', 'success');
    navigate('/admin/applications');
  };
  const handleReject = () => {
    setIsRejectModalOpen(false);
    addToast('Application rejected', 'info');
    navigate('/admin/applications');
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button
          onClick={() => navigate('/admin/applications')}
          className="hover:text-gray-900 flex items-center gap-1">

          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {application.applicantName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.applicantName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-500 flex items-center gap-1 text-sm">
                  <Mail className="w-3 h-3" /> {application.applicantEmail}
                </span>
                <Badge variant="info">Pending Review</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" /> Personal
                  Information
                </h3>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Occupation
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {application.personalInfo.occupation}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Company
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {application.personalInfo.company}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </label>
                  <p className="text-gray-900 font-medium mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />{' '}
                    {application.contactInfo.location}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    LinkedIn
                  </label>
                  <p className="text-blue-600 font-medium mt-1 cursor-pointer hover:underline">
                    {application.personalInfo.linkedin}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Background */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" /> Background &
                  Interests
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bio / Why join?
                  </label>
                  <p className="text-gray-700 mt-2 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {application.background.bio}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.background.interests.map(
                      (interest: string) =>
                      <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>

                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full md:w-80 space-y-4 sticky top-24">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-center"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={() => setIsApproveModalOpen(true)}>

                Approve Application
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                leftIcon={<MessageSquare className="w-4 h-4" />}>

                Request More Info
              </Button>
              <Button
                variant="danger"
                className="w-full justify-center"
                leftIcon={<X className="w-4 h-4" />}
                onClick={() => setIsRejectModalOpen(true)}>

                Reject Application
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Internal Notes</h3>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                rows={4}
                placeholder="Add private notes about this applicant..."
                value={note}
                onChange={(e) => setNote(e.target.value)} />

              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="ghost">
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Application"
        footer={
        <div className="flex justify-end gap-3">
            <Button
            variant="ghost"
            onClick={() => setIsApproveModalOpen(false)}>

              Cancel
            </Button>
            <Button onClick={handleApprove}>Confirm Approval</Button>
          </div>
        }>

        <p className="text-gray-600">
          Are you sure you want to approve{' '}
          <strong>{application.applicantName}</strong>? They will receive an
          email notification and gain access to member-only areas.
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Application"
        footer={
        <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject Application
            </Button>
          </div>
        }>

        <p className="text-gray-600 mb-4">
          Are you sure you want to reject this application? This action cannot
          be undone.
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rejection Reason (Optional - sent to applicant)
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="e.g. Does not meet criteria..." />

      </Modal>
    </div>);

}
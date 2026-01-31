import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2, Pin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Announcement } from '../../types';
export function AnnouncementDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  // Mock Data - in a real app, fetch based on ID
  const announcement: Announcement = {
    id: id || '1',
    title: 'New Community Guidelines',
    content: `
      <p class="mb-4">We have updated our community guidelines to ensure a safe and welcoming environment for everyone. Please review the changes carefully as they affect all members starting next month.</p>
      
      <h3 class="text-xl font-bold mb-2">Key Changes</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Respectful Communication:</strong> We have clarified our policies regarding harassment and hate speech. Zero tolerance will be enforced.</li>
        <li><strong>Content Sharing:</strong> New rules for sharing third-party content and copyright compliance.</li>
        <li><strong>Privacy:</strong> Updated privacy settings for member profiles and direct messaging.</li>
      </ul>

      <h3 class="text-xl font-bold mb-2">Why these changes?</h3>
      <p class="mb-4">As our community grows, we need to adapt our rules to handle new challenges and ensure that this platform remains a positive space for collaboration and learning.</p>

      <p>If you have any questions or concerns, please reach out to the moderation team via the contact form.</p>
    `,
    date: '2024-03-01',
    isPinned: true,
    author: 'Admin Team',
    category: 'urgent',
    visibility: 'public'
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/announcements"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">

        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Announcements
      </Link>

      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge
              variant={
              announcement.category === 'urgent' ? 'danger' : 'default'
              }>

              {announcement.category}
            </Badge>
            {announcement.isPinned &&
            <Badge variant="info" className="flex items-center">
                <Pin className="w-3 h-3 mr-1" /> Pinned
              </Badge>
            }
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(announcement.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {announcement.title}
          </h1>

          {/* Author */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                {announcement.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {announcement.author}
                </p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Share2 className="w-4 h-4" />}>

              Share
            </Button>
          </div>

          {/* Content */}
          <div
            className="prose prose-blue max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: announcement.content
            }} />

        </div>
      </article>

      {/* Related/Other Announcements could go here */}
    </div>);

}
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flag } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
export function DiscussionThreadPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const [replyText, setReplyText] = useState('');
  // Mock Data
  const discussion = {
    id: id || '1',
    title: 'Best practices for remote team management',
    content: `
      <p>Hi everyone,</p>
      <p>I have been struggling with keeping my team engaged while working remotely. We do the standard daily standups and weekly retrospectives, but it feels like the energy is dropping.</p>
      <p>What tools or rituals do you use to maintain culture? Any specific icebreakers or activities that have worked well for your teams?</p>
      <p>Thanks in advance!</p>
    `,
    author: {
      name: 'Sarah Jenkins',
      role: 'Member'
    },
    date: '2 days ago',
    category: 'General',
    likes: 8,
    replies: [
    {
      id: 'r1',
      author: {
        name: 'Alex Rivera',
        role: 'Leader'
      },
      content:
      'We started doing a "virtual coffee break" every Wednesday where work talk is banned. It really helped people connect on a personal level again.',
      date: '1 day ago',
      likes: 5
    },
    {
      id: 'r2',
      author: {
        name: 'David Chen',
        role: 'Member'
      },
      content:
      "Check out Donut for Slack! It randomly pairs people up for chats. It's been a game changer for us.",
      date: '1 day ago',
      likes: 3
    }]

  };
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link
        to="/dashboard/discussions"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">

        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Discussions
      </Link>

      {/* Main Post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge>{discussion.category}</Badge>
            <span className="text-sm text-gray-500">{discussion.date}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {discussion.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <Avatar alt={discussion.author.name} size="md" />
              <div>
                <p className="font-medium text-gray-900">
                  {discussion.author.name}
                </p>
                <p className="text-xs text-gray-500">
                  {discussion.author.role}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Share2 className="w-4 h-4" />}>

                Share
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div
            className="prose prose-blue max-w-none text-gray-800 mb-8"
            dangerouslySetInnerHTML={{
              __html: discussion.content
            }} />


          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ThumbsUp className="w-4 h-4" />}>

              Like ({discussion.likes})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Flag className="w-4 h-4" />}>

              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Replies */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {discussion.replies.length} Replies
      </h3>

      <div className="space-y-6 mb-8">
        {discussion.replies.map((reply) =>
        <div
          key={reply.id}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <div className="flex items-start gap-4">
              <Avatar alt={reply.author.name} />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900 mr-2">
                      {reply.author.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {reply.author.role}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{reply.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{reply.content}</p>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{reply.likes} likes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Leave a reply</h3>
        <div className="flex gap-4">
          <div className="hidden md:block">
            <Avatar alt="Me" />
          </div>
          <div className="flex-1">
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-3"
              placeholder="Share your thoughts..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)} />

            <div className="flex justify-end">
              <Button disabled={!replyText.trim()}>Post Reply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
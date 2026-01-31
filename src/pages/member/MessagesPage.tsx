import React, { useState } from 'react';
import {
  Search,
  Edit,
  MoreVertical,
  Send,
  Paperclip,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isMe: boolean;
}
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}
export function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null>(
    '1');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  // Mock Data
  const conversations: Conversation[] = [
  {
    id: '1',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    lastMessage: 'Thanks for the update!',
    lastMessageTime: '10:30 AM',
    unreadCount: 0,
    isOnline: true,
    messages: [
    {
      id: 'm1',
      senderId: 'u2',
      text: 'Hi Alex, are you going to the town hall meeting?',
      timestamp: '10:00 AM',
      isRead: true,
      isMe: false
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Yes, I plan to be there. Do you want to meet up beforehand?',
      timestamp: '10:15 AM',
      isRead: true,
      isMe: true
    },
    {
      id: 'm3',
      senderId: 'u2',
      text: "That sounds great! Let's meet at the coffee shop at 5:30.",
      timestamp: '10:20 AM',
      isRead: true,
      isMe: false
    },
    {
      id: 'm4',
      senderId: 'me',
      text: 'Perfect, see you then.',
      timestamp: '10:25 AM',
      isRead: true,
      isMe: true
    },
    {
      id: 'm5',
      senderId: 'u2',
      text: 'Thanks for the update!',
      timestamp: '10:30 AM',
      isRead: true,
      isMe: false
    }]

  },
  {
    id: '2',
    userId: 'u3',
    userName: 'Community Admin',
    lastMessage: 'Your application has been approved.',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    isOnline: false,
    messages: [
    {
      id: 'm1',
      senderId: 'u3',
      text: 'Welcome to the community! Your application has been approved.',
      timestamp: 'Yesterday',
      isRead: false,
      isMe: false
    }]

  },
  {
    id: '3',
    userId: 'u4',
    userName: 'David Chen',
    lastMessage: 'Can you share the slides?',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    isOnline: false,
    messages: [
    {
      id: 'm1',
      senderId: 'u4',
      text: 'Hey, great presentation today!',
      timestamp: 'Mon',
      isRead: true,
      isMe: false
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Thanks David! Glad you enjoyed it.',
      timestamp: 'Mon',
      isRead: true,
      isMe: true
    },
    {
      id: 'm3',
      senderId: 'u4',
      text: 'Can you share the slides?',
      timestamp: 'Mon',
      isRead: true,
      isMe: false
    }]

  }];

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // In a real app, this would send to API
    setMessageInput('');
  };
  return (
    <div className="h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
      {/* Sidebar List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col ${selectedConversationId && 'hidden md:flex'}`}>

        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full">

              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm" />

          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) =>
          <div
            key={conversation.id}
            onClick={() => setSelectedConversationId(conversation.id)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversationId === conversation.id ? 'bg-blue-50' : ''}`}>

              <div className="relative">
                <Avatar alt={conversation.userName} />
                {conversation.isOnline &&
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3
                  className={`text-sm font-medium truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>

                    {conversation.userName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <p
                className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>

                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unreadCount > 0 &&
            <div className="w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {conversation.unreadCount}
                </div>
            }
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${!selectedConversationId && 'hidden md:flex'}`}>

        {selectedConversation ?
        <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <button
                className="md:hidden mr-2 text-gray-500"
                onClick={() => setSelectedConversationId(null)}>

                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar alt={selectedConversation.userName} size="sm" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {selectedConversation.userName}
                  </h3>
                  <p className="text-xs text-green-600 flex items-center">
                    {selectedConversation.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Video className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {selectedConversation.messages.map((message) =>
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>

                  <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${message.isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>

                    <p className="text-sm">{message.text}</p>
                    <div
                  className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${message.isMe ? 'text-blue-100' : 'text-gray-400'}`}>

                      {message.timestamp}
                      {message.isMe && (
                  message.isRead ?
                  <CheckCheck className="w-3 h-3" /> :

                  <Check className="w-3 h-3" />)
                  }
                    </div>
                  </div>
                </div>
            )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2">

                <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600">

                  <Paperclip className="w-5 h-5" />
                </Button>
                <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" />

                <Button
                type="submit"
                size="sm"
                className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${!messageInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!messageInput.trim()}>

                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          </> :

        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">
              Choose a person from the list to start chatting
            </p>
          </div>
        }
      </div>
    </div>);

}
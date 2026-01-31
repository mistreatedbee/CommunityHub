import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NewsArticle } from '../../types';
export function NewsDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  // Mock Data
  const article: NewsArticle = {
    id: id || '1',
    title: 'Community Hub 2.0: What to Expect',
    excerpt:
    'We are thrilled to announce the upcoming release of Community Hub 2.0. This major update brings a fresh design, improved performance, and new features requested by you.',
    content: `
      <p class="lead text-xl text-gray-600 mb-8">After months of hard work and feedback from our dedicated members, we are finally ready to unveil the next generation of our community platform.</p>
      
      <p class="mb-6">Community Hub 2.0 isn't just a visual refresh; it's a complete reimagining of how we connect, share, and grow together. We've rebuilt the core architecture to be faster, more reliable, and more accessible than ever before.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">A Fresh New Look</h2>
      <p class="mb-6">The first thing you'll notice is the modern, clean interface. We've adopted a card-based layout that makes it easier to scan content and find what you're looking for. The new design system is also fully responsive, ensuring a seamless experience whether you're on a desktop, tablet, or smartphone.</p>
      
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Dashboard preview" class="w-full rounded-xl my-8 shadow-lg" />

      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Enhanced Networking Features</h2>
      <p class="mb-6">Connecting with other members is at the heart of our community. That's why we've introduced:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Direct Messaging:</strong> Secure, private conversations with other members.</li>
        <li><strong>Interest Groups:</strong> Join sub-communities based on your specific interests or location.</li>
        <li><strong>Member Directory:</strong> Easily find and connect with peers in your industry.</li>
      </ul>

      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Next?</h2>
      <p class="mb-6">We will be rolling out these changes over the next few weeks. Keep an eye on your email for specific migration details. We can't wait to see how you use these new tools to build an even stronger community.</p>
      
      <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 my-8">
        <p class="font-medium text-blue-900"><strong>Note:</strong> There will be a brief downtime on Sunday, March 10th, as we deploy these updates.</p>
      </div>
    `,
    date: '2024-03-05',
    author: 'Sarah Jenkins',
    category: 'Product Update',
    imageUrl:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  };
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Link
              to="/news"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">

              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
            <Badge className="bg-[var(--color-primary)] text-white border-none mb-4 self-start">
              {article.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center text-white/90 text-sm md:text-base">
              <div className="flex items-center mr-8">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 font-bold">
                  {article.author.charAt(0)}
                </div>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {new Date(article.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-sm border-x border-t border-gray-100">
          {/* Content */}
          <div
            className="prose prose-lg prose-blue max-w-none text-gray-800"
            dangerouslySetInnerHTML={{
              __html: article.content
            }} />


          {/* Share Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Share this article
            </h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Facebook className="w-4 h-4" />}>

                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Twitter className="w-4 h-4" />}>

                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Linkedin className="w-4 h-4" />}>

                LinkedIn
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Share2 className="w-4 h-4" />}>

                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
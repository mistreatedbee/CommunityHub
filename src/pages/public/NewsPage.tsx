import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Clock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NewsArticle } from '../../types';
export function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  // Mock Data
  const articles: NewsArticle[] = [
  {
    id: '1',
    title: 'Community Hub 2.0: What to Expect',
    excerpt:
    'We are thrilled to announce the upcoming release of Community Hub 2.0. This major update brings a fresh design, improved performance, and new features requested by you.',
    content: '...',
    date: '2024-03-05',
    author: 'Sarah Jenkins',
    category: 'Product Update',
    imageUrl:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Member Spotlight: Alex Rivera',
    excerpt:
    'Meet Alex Rivera, a community member who has been instrumental in organizing our local cleanup drives. Learn about his motivation and how you can get involved.',
    content: '...',
    date: '2024-03-01',
    author: 'Editorial Team',
    category: 'Community Stories',
    imageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Recap: Annual Winter Gala',
    excerpt:
    'Our Annual Winter Gala was a huge success! Over 200 members attended, raising funds for our scholarship program. Check out the photos and highlights.',
    content: '...',
    date: '2024-02-20',
    author: 'Events Committee',
    category: 'Events',
    imageUrl:
    'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: '5 Tips for Effective Networking',
    excerpt:
    'Networking is more than just exchanging business cards. Here are five proven strategies to build meaningful professional relationships within our community.',
    content: '...',
    date: '2024-02-15',
    author: 'Professional Development',
    category: 'Resources',
    imageUrl:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Sustainability Initiative Launch',
    excerpt:
    'We are launching a new initiative to reduce our carbon footprint. From digital-first events to eco-friendly merchandise, see how we are making a difference.',
    content: '...',
    date: '2024-02-10',
    author: 'Green Team',
    category: 'Initiatives',
    imageUrl:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const categories = [
  'All',
  'Product Update',
  'Community Stories',
  'Events',
  'Resources',
  'Initiatives'];

  const filteredArticles =
  activeCategory === 'All' ?
  articles :
  articles.filter((article) => article.category === activeCategory);
  const featuredArticle = articles[0];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          News & Stories
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover the latest updates, inspiring stories, and helpful resources
          from our community.
        </p>
      </div>

      {/* Featured Article */}
      <div className="mb-16">
        <Link
          to={`/news/${featuredArticle.id}`}
          className="group relative block rounded-2xl overflow-hidden shadow-xl aspect-[21/9]">

          <img
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <Badge className="self-start mb-4 bg-[var(--color-primary)] text-white border-none">
              Featured
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
              {featuredArticle.title}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl max-w-3xl line-clamp-2 mb-6">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center text-gray-300 text-sm font-medium">
              <span className="flex items-center mr-6">
                <User className="w-4 h-4 mr-2" />
                {featuredArticle.author}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(featuredArticle.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) =>
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>

                  {category}
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Subscribe</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest news delivered to your inbox.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

            <Button size="sm" className="w-full">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Article Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAnnouncements.map((article) =>
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="group flex flex-col h-full">

                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                    Read Article <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>);

}
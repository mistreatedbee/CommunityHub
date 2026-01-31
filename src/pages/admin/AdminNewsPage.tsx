import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Image as ImageIcon } from
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
import { NewsArticle } from '../../types';
export function AdminNewsPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const [articles, setArticles] = useState<NewsArticle[]>([
  {
    id: '1',
    title: 'Community Hub 2.0 Launch',
    excerpt: 'We are thrilled to announce...',
    content: 'Full content here...',
    date: '2024-03-05',
    author: 'Sarah Jenkins',
    category: 'Product Update',
    imageUrl:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Member Spotlight: Alex Rivera',
    excerpt: 'Meet Alex Rivera...',
    content: 'Full content here...',
    date: '2024-03-01',
    author: 'Editorial Team',
    category: 'Community Stories'
  }]
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-500">Manage blog posts and news articles.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}>

          Write Article
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />

          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Article</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Author</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) =>
            <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {article.imageUrl ?
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-full h-full object-cover" /> :


                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                    }
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {article.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {article.excerpt}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{article.category}</Badge>
                </TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>
                  {new Date(article.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Published</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" title="Preview">
                      <ExternalLink className="w-4 h-4" />
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
        title="Write Article"
        size="xl"
        footer={
        <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Save Draft
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
              onClick={() => {
                addToast('Article published', 'success');
                setIsModalOpen(false);
              }}>

                Publish
              </Button>
            </div>
          </>
        }>

        <div className="space-y-4">
          <Input label="Title" placeholder="Article headline" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Product Update" />
            <Input label="Image URL" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={2}
              placeholder="Short summary..." />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono text-sm"
              rows={12}
              placeholder="Write your article content here (Markdown supported)..." />

          </div>
        </div>
      </Modal>
    </div>);

}
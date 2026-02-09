import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  location: string | null;
  logo_url: string | null;
};

type PostRow = {
  id: string;
  title: string;
  content: string;
  published_at: string;
};

export function TenantPublicPage() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const [tenant, setTenant] = useState<TenantRow | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!tenantSlug) return;
      const { data: tenantData } = await supabase
        .from('organizations')
        .select('id, name, slug, description, category, location, logo_url')
        .eq('slug', tenantSlug)
        .eq('is_public', true)
        .maybeSingle<TenantRow>();

      if (!tenantData) {
        setTenant(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      setTenant(tenantData);

      const { data: postRows } = await supabase
        .from('tenant_posts')
        .select('id, title, content, published_at')
        .eq('organization_id', tenantData.id)
        .eq('visibility', 'public')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6)
        .returns<PostRow[]>();

      setPosts(postRows ?? []);
      setLoading(false);
    };

    void load();
  }, [tenantSlug]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="py-20">
        <EmptyState
          icon={Search}
          title="Community not found"
          description="This community might be inactive or unavailable."
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-semibold overflow-hidden">
            {tenant.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
            ) : (
              tenant.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="text-sm text-gray-500">{tenant.category ?? 'Community'} · {tenant.location ?? 'Global'}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-6">{tenant.description ?? 'Join this community to connect and collaborate.'}</p>
        <Link
          to={`/c/${tenant.slug}/join`}
          className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
        >
          Join community
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Updates</h2>
        {posts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No public posts yet"
            description="This community has not published any public posts."
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{new Date(post.published_at).toLocaleDateString()}</p>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

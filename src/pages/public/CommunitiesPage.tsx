import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
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

export function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('organizations')
        .select('id, name, slug, description, category, location, logo_url')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('name', { ascending: true })
        .returns<TenantRow[]>();
      setTenants(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tenants;
    return tenants.filter((tenant) =>
      [tenant.name, tenant.category, tenant.location]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [searchTerm, tenants]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-500">Find a community that matches your goals.</p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by name, category, location..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No communities found"
          description="Try adjusting your search to discover more communities."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tenant) => (
            <Link
              key={tenant.id}
              to={`/c/${tenant.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-semibold overflow-hidden">
                  {tenant.logo_url ? (
                    <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
                  ) : (
                    tenant.name.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{tenant.name}</h2>
                  <p className="text-xs text-gray-500">{tenant.category ?? 'Community'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {tenant.description ?? 'Join this community to connect with members and resources.'}
              </p>
              <div className="mt-4 text-xs text-gray-500">{tenant.location ?? 'Global'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

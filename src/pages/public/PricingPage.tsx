import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

type PlanRow = {
  id: string;
  name: string;
  price_cents: number;
  billing_cycle: string;
  max_members: number;
  max_admins: number;
  max_storage_mb: number;
  max_posts: number;
  max_resources: number;
  feature_flags: Record<string, boolean>;
};

export function PricingPage() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('licenses')
        .select('id, name, price_cents, billing_cycle, max_members, max_admins, max_storage_mb, max_posts, max_resources, feature_flags')
        .order('price_cents', { ascending: true })
        .returns<PlanRow[]>();
      setPlans(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="text-gray-500">Select the plan that matches your community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {(plan.price_cents / 100).toFixed(0)} <span className="text-sm font-medium text-gray-500">/ {plan.billing_cycle}</span>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>Max members: {plan.max_members}</li>
              <li>Max admins: {plan.max_admins}</li>
              <li>Max posts: {plan.max_posts}</li>
              <li>Max resources: {plan.max_resources}</li>
              <li>Storage: {plan.max_storage_mb} MB</li>
            </ul>
            <Button className="mt-auto w-full">Contact Sales</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

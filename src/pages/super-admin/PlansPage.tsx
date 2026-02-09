import React, { useEffect, useState } from 'react';
import { Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../utils/audit';

type PlanRow = {
  id: string;
  name: string;
  price_cents: number;
  billing_cycle: 'monthly' | 'yearly';
  max_members: number;
  max_admins: number;
  max_storage_mb: number;
  max_posts: number;
  max_resources: number;
  feature_flags: Record<string, boolean>;
};
export function PlansPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanRow | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [maxMembers, setMaxMembers] = useState(0);
  const [maxAdmins, setMaxAdmins] = useState(0);
  const [maxStorage, setMaxStorage] = useState(0);
  const [maxPosts, setMaxPosts] = useState(0);
  const [maxResources, setMaxResources] = useState(0);
  const [features, setFeatures] = useState('');

  const loadPlans = async () => {
    const { data } = await supabase
      .from('licenses')
      .select('id, name, price_cents, billing_cycle, max_members, max_admins, max_storage_mb, max_posts, max_resources, feature_flags')
      .order('price_cents', { ascending: true })
      .returns<PlanRow[]>();
    setPlans(data ?? []);
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const openModal = (plan?: PlanRow) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setPrice(plan.price_cents / 100);
      setBillingCycle(plan.billing_cycle);
      setMaxMembers(plan.max_members);
      setMaxAdmins(plan.max_admins);
      setMaxStorage(plan.max_storage_mb);
      setMaxPosts(plan.max_posts);
      setMaxResources(plan.max_resources);
      setFeatures(Object.keys(plan.feature_flags || {}).join('\n'));
    } else {
      setEditingPlan(null);
      setName('');
      setPrice(0);
      setBillingCycle('monthly');
      setMaxMembers(0);
      setMaxAdmins(0);
      setMaxStorage(0);
      setMaxPosts(0);
      setMaxResources(0);
      setFeatures('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      addToast('Plan name is required.', 'error');
      return;
    }
    const featureFlags = features
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});

    const payload = {
      name,
      price_cents: Math.round(price * 100),
      billing_cycle: billingCycle,
      max_members: maxMembers,
      max_admins: maxAdmins,
      max_storage_mb: maxStorage,
      max_posts: maxPosts,
      max_resources: maxResources,
      feature_flags: featureFlags
    };

    const { error } = editingPlan
      ? await supabase.from('licenses').update(payload).eq('id', editingPlan.id)
      : await supabase.from('licenses').insert(payload);
    if (error) {
      addToast('Unable to save plan.', 'error');
      return;
    }
    await logAudit(editingPlan ? 'license_updated' : 'license_created', null, { name });
    addToast('Plan saved.', 'success');
    setIsModalOpen(false);
    await loadPlans();
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Delete this plan?')) return;
    const { error } = await supabase.from('licenses').delete().eq('id', planId);
    if (error) {
      addToast('Unable to delete plan.', 'error');
      return;
    }
    await logAudit('license_deleted', null, { plan_id: planId });
    addToast('Plan deleted.', 'success');
    await loadPlans();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans & Pricing</h1>
          <p className="text-gray-500">
            Manage subscription tiers and features.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openModal()}>

          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) =>
        <Card key={plan.id} className="flex flex-col h-full">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${Math.round(plan.price_cents / 100)}
                </span>
                <span className="text-gray-500 ml-1">
                  /{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-500 mb-6">
                Up to {plan.max_members.toLocaleString()} members
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {Object.keys(plan.feature_flags || {}).map((feature, i) =>
              <li
                key={i}
                className="flex items-start text-sm text-gray-600">

                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    {feature}
                  </li>
              )}
              </ul>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <Button
                variant="outline"
                className="flex-1"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => openModal(plan)}>

                  Edit
                </Button>
                <Button
                variant="ghost"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => void handleDelete(plan.id)}>

                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Plan"
        footer={
        <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()}>

              Save Plan
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Plan Name" placeholder="e.g. Business" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <Input label="Max Members" type="number" placeholder="1000" value={maxMembers} onChange={(e) => setMaxMembers(Number(e.target.value))} />
          <Input label="Max Admins" type="number" placeholder="5" value={maxAdmins} onChange={(e) => setMaxAdmins(Number(e.target.value))} />
          <Input label="Max Storage (MB)" type="number" placeholder="1024" value={maxStorage} onChange={(e) => setMaxStorage(Number(e.target.value))} />
          <Input label="Max Posts" type="number" placeholder="200" value={maxPosts} onChange={(e) => setMaxPosts(Number(e.target.value))} />
          <Input label="Max Resources" type="number" placeholder="50" value={maxResources} onChange={(e) => setMaxResources(Number(e.target.value))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              value={features}
              onChange={(e) => setFeatures(e.target.value)} />

          </div>
        </div>
      </Modal>
    </div>);

}
import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Plan } from '../../types';
export function PlansPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock Data
  const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    billingCycle: 'monthly',
    features: [
    'Up to 500 members',
    'Basic Analytics',
    'Standard Support',
    '1 Admin'],

    maxMembers: 500,
    isActive: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    billingCycle: 'monthly',
    features: [
    'Up to 5,000 members',
    'Advanced Analytics',
    'Priority Support',
    '5 Admins',
    'Custom Domain'],

    maxMembers: 5000,
    isActive: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billingCycle: 'monthly',
    features: [
    'Unlimited members',
    'Custom Reports',
    'Dedicated Success Manager',
    'Unlimited Admins',
    'SSO',
    'SLA'],

    maxMembers: 999999,
    isActive: true
  }];

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
          onClick={() => setIsModalOpen(true)}>

          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) =>
        <Card key={plan.id} className="flex flex-col h-full">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <Badge variant={plan.isActive ? 'success' : 'secondary'}>
                  {plan.isActive ? 'Active' : 'Archived'}
                </Badge>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-500 ml-1">
                  /{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-500 mb-6">
                Up to {plan.maxMembers.toLocaleString()} members
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) =>
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
                leftIcon={<Edit2 className="w-4 h-4" />}>

                  Edit
                </Button>
                <Button
                variant="ghost"
                className="text-red-600 hover:bg-red-50 hover:text-red-700">

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
            <Button
            onClick={() => {
              addToast('Plan created successfully', 'success');
              setIsModalOpen(false);
            }}>

              Save Plan
            </Button>
          </>
        }>

        <div className="space-y-4">
          <Input label="Plan Name" placeholder="e.g. Business" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" placeholder="0.00" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <Input label="Max Members" type="number" placeholder="1000" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />

          </div>
        </div>
      </Modal>
    </div>);

}
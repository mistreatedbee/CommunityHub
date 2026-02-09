import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { getPasswordValidationError, isValidEmail } from '../../utils/validation';

type PlanRow = {
  id: string;
  name: string;
};

export function TenantAdminRegisterPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planId, setPlanId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('licenses')
        .select('id, name')
        .order('price_cents', { ascending: true })
        .returns<PlanRow[]>();
      setPlans(data ?? []);
      if (data?.length) setPlanId(data[0].id);
    };
    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tenantName.trim() || !tenantSlug.trim()) {
      addToast('Tenant name and slug are required.', 'error');
      return;
    }
    if (!fullName.trim()) {
      addToast('Full name is required.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('Enter a valid email address.', 'error');
      return;
    }
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      addToast(passwordError, 'error');
      return;
    }

    setLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (signUpError || !signUpData.user) {
      addToast(signUpError?.message ?? 'Unable to create account.', 'error');
      setLoading(false);
      return;
    }

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: tenantName,
        slug: tenantSlug,
        status: 'active'
      })
      .select('id')
      .maybeSingle<{ id: string }>();
    if (orgError || !orgData) {
      addToast('Unable to create tenant.', 'error');
      setLoading(false);
      return;
    }

    await supabase.from('organization_memberships').insert({
      organization_id: orgData.id,
      user_id: signUpData.user.id,
      role: 'owner',
      status: 'active'
    });

    await supabase.from('organization_licenses').insert({
      organization_id: orgData.id,
      license_id: planId,
      status: 'trial'
    });

    await supabase.from('tenant_settings').insert({
      organization_id: orgData.id
    });

    setLoading(false);
    addToast('Tenant created. Continue onboarding.', 'success');
    navigate(`/c/${tenantSlug}/admin/onboarding`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create your community hub</h1>
        <p className="text-gray-500">Register as a tenant admin and start your setup.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5">
        <Input label="Community Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
        <Input label="Community Slug" value={tenantSlug} onChange={(e) => setTenantSlug(e.target.value)} />
        <Input label="Your Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" isLoading={loading} className="w-full">
          Create Tenant
        </Button>
      </form>
    </div>
  );
}

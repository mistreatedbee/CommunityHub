import React, { useEffect, useState } from 'react';
import { FormInput } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';

type FieldRow = {
  id: string;
  key: string;
  label: string;
  field_type: string;
  required: boolean;
  field_order: number;
  is_active: boolean;
};

export function TenantAdminRegistrationFormPage() {
  const { tenant, settings, refresh } = useTenant();
  const { addToast } = useToast();
  const [fields, setFields] = useState<FieldRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);
  const [publicSignup, setPublicSignup] = useState(settings?.public_signup ?? true);
  const [approvalRequired, setApprovalRequired] = useState(settings?.approval_required ?? false);

  const loadFields = async () => {
    if (!tenant) return;
    setLoading(true);
    const { data } = await supabase
      .from('registration_fields')
      .select('id, key, label, field_type, required, field_order, is_active')
      .eq('organization_id', tenant.id)
      .order('field_order', { ascending: true })
      .returns<FieldRow[]>();
    setFields(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (settings) {
      setPublicSignup(settings.public_signup);
      setApprovalRequired(settings.approval_required);
    }
  }, [settings?.public_signup, settings?.approval_required]);

  useEffect(() => {
    void loadFields();
  }, [tenant?.id]);

  const handleAddField = async () => {
    if (!tenant) return;
    if (!label.trim() || !key.trim()) {
      addToast('Field key and label are required.', 'error');
      return;
    }
    const { error } = await supabase.from('registration_fields').insert({
      organization_id: tenant.id,
      key,
      label,
      field_type: fieldType,
      required,
      field_order: fields.length
    });
    if (error) {
      addToast('Unable to add field.', 'error');
      return;
    }
    setLabel('');
    setKey('');
    setFieldType('text');
    setRequired(false);
    await loadFields();
  };

  const handleSettingsSave = async () => {
    if (!tenant) return;
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        organization_id: tenant.id,
        public_signup: publicSignup,
        approval_required: approvalRequired,
        registration_fields_enabled: true
      });
    if (error) {
      addToast('Unable to update settings.', 'error');
      return;
    }
    await refresh();
    addToast('Registration settings updated.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registration Form</h1>
        <p className="text-gray-500">Configure member onboarding and approvals.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
            <p className="text-xs text-gray-500">Toggle approvals and public signups.</p>
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" checked={publicSignup} onChange={(e) => setPublicSignup(e.target.checked)} />
          Allow public signups
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" checked={approvalRequired} onChange={(e) => setApprovalRequired(e.target.checked)} />
          Require admin approval
        </label>
        <Button onClick={() => void handleSettingsSave()}>Save settings</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Add field</h2>
        <Input label="Field key" value={key} onChange={(e) => setKey(e.target.value)} />
        <Input label="Field label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Field type</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="textarea">Long text</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="date">Date</option>
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
          Required field
        </label>
        <Button onClick={() => void handleAddField()}>Add field</Button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading fields...</div>
      ) : fields.length === 0 ? (
        <EmptyState icon={FormInput} title="No custom fields" description="Add fields to collect member info." />
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{field.label}</p>
                  <p className="text-xs text-gray-500">{field.key} · {field.field_type}</p>
                </div>
                <span className="text-xs text-gray-500">{field.required ? 'Required' : 'Optional'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

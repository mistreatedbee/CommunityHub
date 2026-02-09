import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

type SettingsRow = {
  id: string;
  platform_name: string;
  support_email: string | null;
  terms_url: string | null;
  privacy_url: string | null;
};

export function SuperAdminSettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('platform_settings')
        .select('id, platform_name, support_email, terms_url, privacy_url')
        .limit(1)
        .maybeSingle<SettingsRow>();
      setSettings(data ?? null);
      setLoading(false);
    };
    void load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('platform_settings').upsert(settings);
    setSaving(false);
    if (error) {
      addToast('Unable to save settings.', 'error');
      return;
    }
    addToast('Settings saved.', 'success');
  };

  if (loading) {
    return <div className="text-gray-500">Loading settings...</div>;
  }

  if (!settings) {
    const createDefault = async () => {
      const { data } = await supabase
        .from('platform_settings')
        .insert({ platform_name: 'CommunityHub' })
        .select('id, platform_name, support_email, terms_url, privacy_url')
        .maybeSingle<SettingsRow>();
      setSettings(data ?? null);
    };
    void createDefault();
    return <div className="text-gray-500">Initializing settings...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500">Configure global settings and policies.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input
          label="Platform name"
          value={settings.platform_name}
          onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
        />
        <Input
          label="Support email"
          type="email"
          value={settings.support_email ?? ''}
          onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
        />
        <Input
          label="Terms URL"
          value={settings.terms_url ?? ''}
          onChange={(e) => setSettings({ ...settings, terms_url: e.target.value })}
        />
        <Input
          label="Privacy URL"
          value={settings.privacy_url ?? ''}
          onChange={(e) => setSettings({ ...settings, privacy_url: e.target.value })}
        />
        <Button onClick={() => void handleSave()} isLoading={saving}>
          Save settings
        </Button>
      </div>
    </div>
  );
}

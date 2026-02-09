import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function TenantAdminOnboardingPage() {
  const { user } = useAuth();
  const { tenant, refresh } = useTenant();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(tenant?.name ?? '');
  const [description, setDescription] = useState(tenant?.description ?? '');
  const [logoUrl, setLogoUrl] = useState(tenant?.logo_url ?? '');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color ?? '#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState(tenant?.secondary_color ?? '#10B981');
  const [category, setCategory] = useState(tenant?.category ?? '');
  const [location, setLocation] = useState(tenant?.location ?? '');
  const [contactEmail, setContactEmail] = useState(tenant?.contact_email ?? '');
  const [isPublic, setIsPublic] = useState(tenant?.is_public ?? true);
  const [publicSignup, setPublicSignup] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleProfileSave = async () => {
    if (!tenant) return;
    await supabase
      .from('organizations')
      .update({
        name,
        description,
        logo_url: logoUrl || null,
        primary_color: primaryColor || null,
        secondary_color: secondaryColor || null,
        category: category || null,
        location: location || null,
        contact_email: contactEmail || null,
        is_public: isPublic
      })
      .eq('id', tenant.id);
    await refresh();
    addToast('Tenant profile saved.', 'success');
    setStep(2);
  };

  const handleRegistrationSave = async () => {
    if (!tenant) return;
    await supabase.from('tenant_settings').upsert({
      organization_id: tenant.id,
      public_signup: publicSignup,
      approval_required: approvalRequired,
      registration_fields_enabled: true
    });
    addToast('Registration settings saved.', 'success');
    setStep(3);
  };

  const handleFirstPost = async () => {
    if (!tenant || !user) return;
    if (!postTitle.trim() || !postContent.trim()) {
      addToast('Title and content are required.', 'error');
      return;
    }
    await supabase.from('tenant_posts').insert({
      organization_id: tenant.id,
      created_by: user.id,
      title: postTitle,
      content: postContent,
      visibility: 'members',
      is_published: true
    });
    addToast('First post created.', 'success');
    setStep(4);
  };

  const handleInvite = async () => {
    if (!tenant || !inviteEmail.trim()) return;
    await supabase.from('invitations').insert({
      organization_id: tenant.id,
      email: inviteEmail,
      role: 'member',
      token: crypto.randomUUID(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    });
    addToast('Invitation sent.', 'success');
    setInviteEmail('');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Wizard</h1>
        <p className="text-gray-500">Complete these steps to launch your community.</p>
      </div>

      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Step 1: Tenant profile</h2>
          <Input label="Tenant name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Primary color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
            <Input label="Secondary color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <Input label="Contact email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            List community in public directory
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm"
              rows={4}
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={() => void handleProfileSave()}>Save and continue</Button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Step 2: Registration settings</h2>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={publicSignup} onChange={(e) => setPublicSignup(e.target.checked)} />
            Allow public signups
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={approvalRequired} onChange={(e) => setApprovalRequired(e.target.checked)} />
            Require admin approval
          </label>
          <Button onClick={() => void handleRegistrationSave()}>Save and continue</Button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Step 3: First post</h2>
          <Input label="Post title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Post content</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm"
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <Button onClick={() => void handleFirstPost()}>Publish and continue</Button>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Step 4: Invite members</h2>
          <Input label="Invite email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Button onClick={() => void handleInvite()}>Send invite</Button>
          <Button variant="outline" onClick={() => setStep(1)}>
            Finish onboarding
          </Button>
        </div>
      )}
    </div>
  );
}

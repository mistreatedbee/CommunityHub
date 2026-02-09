import React from 'react';
import { CreditCard } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';

export function TenantAdminBillingPage() {
  const { license } = useTenant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
        <p className="text-gray-500">Review your current license and usage limits.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
        </div>
        <p className="text-sm text-gray-600">
          Plan: {license?.license.name ?? 'No plan assigned'} · Status: {license?.status ?? 'unknown'}
        </p>
        {(license?.status === 'expired' || license?.status === 'cancelled') && (
          <p className="text-sm text-red-600 mt-2">
            This license is no longer active. Content creation is disabled until renewed.
          </p>
        )}
        {license?.starts_at && (
          <p className="text-xs text-gray-500 mt-1">
            Started {new Date(license.starts_at).toLocaleDateString()}
            {license.ends_at ? ` · Ends ${new Date(license.ends_at).toLocaleDateString()}` : ''}
          </p>
        )}
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <div>Max members: {license?.license.max_members ?? '-'}</div>
          <div>Max admins: {license?.license.max_admins ?? '-'}</div>
          <div>Max posts: {license?.license.max_posts ?? '-'}</div>
          <div>Max resources: {license?.license.max_resources ?? '-'}</div>
          <div>Storage limit: {license?.license.max_storage_mb ?? '-'} MB</div>
        </div>
        <div className="mt-6">
          <a
            href="/pricing"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
          >
            View upgrade options
          </a>
        </div>
      </div>
    </div>
  );
}

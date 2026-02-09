import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';

type AuditRow = {
  id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  organization_id: string | null;
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select('id, action, metadata, created_at, organization_id')
        .order('created_at', { ascending: false })
        .limit(50)
        .returns<AuditRow[]>();
      setLogs(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500">Track sensitive actions across the platform.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No audit entries yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <p className="text-sm font-medium text-gray-900">{log.action}</p>
              <p className="text-xs text-gray-500">
                {new Date(log.created_at).toLocaleString()} · Tenant: {log.organization_id ?? 'Platform'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

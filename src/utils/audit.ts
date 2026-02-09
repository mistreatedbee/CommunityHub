import { supabase } from '../lib/supabase';

export async function logAudit(action: string, tenantId: string | null, metadata: Record<string, unknown> = {}) {
  await supabase.from('audit_logs').insert({
    organization_id: tenantId,
    action,
    entity_type: metadata.entity_type ?? 'system',
    entity_id: metadata.entity_id ?? null,
    metadata
  });
}

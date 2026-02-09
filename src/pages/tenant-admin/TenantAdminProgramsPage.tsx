import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { logAudit } from '../../utils/audit';
import { notifyTenantMembers } from '../../utils/notifications';

type ProgramRow = {
  id: string;
  name: string;
  description: string | null;
};

type ModuleRow = {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  module_order: number;
};

type GroupRow = {
  id: string;
  name: string;
};

type MemberRow = {
  user_id: string;
  profile: { full_name: string | null; email: string | null } | null;
};

export function TenantAdminProgramsPage() {
  const { user } = useAuth();
  const { tenant, license } = useTenant();
  const { addToast } = useToast();
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramRow | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [memberId, setMemberId] = useState('');

  const loadPrograms = async () => {
    if (!tenant) return;
    const { data } = await supabase
      .from('programs')
      .select('id, name, description')
      .eq('organization_id', tenant.id)
      .order('created_at', { ascending: false })
      .returns<ProgramRow[]>();
    setPrograms(data ?? []);
  };

  const loadModules = async (programId: string) => {
    const { data } = await supabase
      .from('program_modules')
      .select('id, program_id, title, description, module_order')
      .eq('program_id', programId)
      .order('module_order', { ascending: true })
      .returns<ModuleRow[]>();
    setModules(data ?? []);
  };

  const loadGroupsAndMembers = async () => {
    if (!tenant) return;
    const [{ data: groupRows }, { data: memberRows }] = await Promise.all([
      supabase.from('groups').select('id, name').eq('organization_id', tenant.id).returns<GroupRow[]>(),
      supabase
        .from('organization_memberships')
        .select('user_id, profile:profiles(full_name, email)')
        .eq('organization_id', tenant.id)
        .eq('status', 'active')
        .returns<MemberRow[]>()
    ]);
    setGroups(groupRows ?? []);
    setMembers(memberRows ?? []);
  };

  useEffect(() => {
    void loadPrograms();
    void loadGroupsAndMembers();
  }, [tenant?.id]);

  useEffect(() => {
    if (selectedProgram) {
      void loadModules(selectedProgram.id);
    }
  }, [selectedProgram?.id]);

  const handleCreateProgram = async () => {
    if (!tenant || !user) return;
    if (license?.status === 'expired' || license?.status === 'cancelled') {
      addToast('License inactive. Upgrade to create programs.', 'error');
      return;
    }
    if (!name.trim()) {
      addToast('Program name is required.', 'error');
      return;
    }
    const { error } = await supabase.from('programs').insert({
      organization_id: tenant.id,
      name,
      description,
      created_by: user.id
    });
    if (error) {
      addToast('Unable to create program.', 'error');
      return;
    }
    await logAudit('program_created', tenant.id, { name });
    setName('');
    setDescription('');
    await loadPrograms();
  };

  const handleAddModule = async () => {
    if (!selectedProgram) return;
    if (!moduleTitle.trim()) {
      addToast('Module title is required.', 'error');
      return;
    }
    const { error } = await supabase.from('program_modules').insert({
      program_id: selectedProgram.id,
      title: moduleTitle,
      description: moduleDescription,
      module_order: modules.length
    });
    if (error) {
      addToast('Unable to add module.', 'error');
      return;
    }
    await logAudit('program_module_added', tenant?.id ?? null, { program_id: selectedProgram.id, title: moduleTitle });
    setModuleTitle('');
    setModuleDescription('');
    await loadModules(selectedProgram.id);
  };

  const handleAssign = async () => {
    if (!selectedProgram) return;
    if (!groupId && !memberId) {
      addToast('Select a group or member to assign.', 'error');
      return;
    }
    const { error } = await supabase.from('program_assignments').insert({
      program_id: selectedProgram.id,
      group_id: groupId || null,
      user_id: memberId || null
    });
    if (error) {
      addToast('Unable to assign program.', 'error');
      return;
    }
    await logAudit('program_assigned', tenant?.id ?? null, { program_id: selectedProgram.id, group_id: groupId, user_id: memberId });
    if (memberId && tenant) {
      await supabase.from('notifications').insert({
        organization_id: tenant.id,
        user_id: memberId,
        type: 'program',
        title: 'New program assigned',
        body: `${selectedProgram.name} has been assigned to you.`
      });
    } else if (groupId && tenant) {
      await notifyTenantMembers(tenant.id, {
        type: 'program',
        title: 'New program available',
        body: `${selectedProgram.name} is now available for your group.`
      });
    }
    setGroupId('');
    setMemberId('');
    addToast('Program assigned.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programs & Classes</h1>
        <p className="text-gray-500">Organize training content and assign participants.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Input label="Program name" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button onClick={() => void handleCreateProgram()}>Create program</Button>
      </div>

      {programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No programs yet" description="Create a program to get started." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            {programs.map((program) => (
              <button
                type="button"
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className={`w-full text-left px-3 py-2 rounded-lg border ${selectedProgram?.id === program.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="text-sm font-semibold text-gray-900">{program.name}</div>
                <div className="text-xs text-gray-500">{program.description ?? 'No description'}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            {selectedProgram ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedProgram.name}</h2>
                  <p className="text-sm text-gray-500">{selectedProgram.description ?? 'No description.'}</p>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900">Add module</h3>
                  <Input label="Module title" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                  <Input label="Module description" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                  <Button onClick={() => void handleAddModule()}>Add module</Button>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900">Assign program</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                    >
                      <option value="">Select group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.profile?.full_name ?? member.profile?.email ?? 'Member'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={() => void handleAssign()}>Assign</Button>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900">Modules</h3>
                  {modules.length === 0 ? (
                    <p className="text-sm text-gray-500">No modules yet.</p>
                  ) : (
                    modules.map((module) => (
                      <div key={module.id} className="text-sm text-gray-700">
                        {module.module_order + 1}. {module.title}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Select a program to manage modules.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

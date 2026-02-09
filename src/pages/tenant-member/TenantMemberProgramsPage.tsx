import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';

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

export function TenantMemberProgramsPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledProgramIds, setEnrolledProgramIds] = useState<string[]>([]);

  const loadPrograms = async () => {
    if (!tenant || !user) return;
    setLoading(true);
    const { data: allPrograms } = await supabase
      .from('programs')
      .select('id, name, description')
      .eq('organization_id', tenant.id)
      .returns<ProgramRow[]>();
    const programIds = (allPrograms ?? []).map((program) => program.id);
    const { data: assignments } = await supabase
      .from('program_assignments')
      .select('program_id, group_id, user_id')
      .in('program_id', programIds.length ? programIds : ['00000000-0000-0000-0000-000000000000'])
      .returns<{ program_id: string; group_id: string | null; user_id: string | null }[]>();
    const { data: memberships } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', user.id)
      .returns<{ group_id: string }[]>();
    const groupIds = memberships?.map((row) => row.group_id) ?? [];
    const allowedProgramIds = (assignments ?? [])
      .filter((assignment) => assignment.user_id === user.id || (assignment.group_id && groupIds.includes(assignment.group_id)))
      .map((assignment) => assignment.program_id);

    const programRows = (allPrograms ?? []).filter((program) => allowedProgramIds.includes(program.id));
    const { data: enrollmentRows } = await supabase
      .from('program_enrollments')
      .select('program_id')
      .eq('user_id', user.id)
      .returns<{ program_id: string }[]>();
    const { data: moduleRows } = await supabase
      .from('program_modules')
      .select('id, program_id, title, description, module_order')
      .in('program_id', allowedProgramIds.length ? allowedProgramIds : ['00000000-0000-0000-0000-000000000000'])
      .order('module_order', { ascending: true })
      .returns<ModuleRow[]>();
    setPrograms(programRows ?? []);
    setModules(moduleRows ?? []);
    setEnrolledProgramIds((enrollmentRows ?? []).map((row) => row.program_id));
    setLoading(false);
  };

  useEffect(() => {
    void loadPrograms();
  }, [tenant?.id, user?.id]);

  const handleEnroll = async (programId: string) => {
    if (!user) return;
    await supabase.from('program_enrollments').upsert({
      program_id: programId,
      user_id: user.id,
      status: 'active'
    });
    setEnrolledProgramIds((prev) => Array.from(new Set([...prev, programId])));
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <p className="text-gray-500">Track your assigned classes and training.</p>
      </div>

      {programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No programs assigned" description="Check back later for updates." />
      ) : (
        <div className="space-y-4">
          {programs.map((program) => (
            <div key={program.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{program.name}</h3>
                  <p className="text-sm text-gray-600">{program.description ?? 'No description.'}</p>
                </div>
                {enrolledProgramIds.includes(program.id) ? (
                  <span className="text-xs text-green-600">Enrolled</span>
                ) : (
                  <Button size="sm" onClick={() => void handleEnroll(program.id)}>
                    Enroll
                  </Button>
                )}
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                {modules.filter((module) => module.program_id === program.id).map((module) => (
                  <div key={module.id}>
                    {module.module_order + 1}. {module.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

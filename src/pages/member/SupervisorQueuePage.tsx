import React, { useEffect, useMemo, useState } from 'react';
import { Eye, ClipboardCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

type AssignmentRow = {
  id: string;
  submission_id: string;
  form_id: string | null;
  status: 'assigned' | 'in_progress' | 'completed' | 'flagged';
  note: string | null;
  assigned_at: string;
};

type SubmissionRow = {
  id: string;
  payload: Record<string, unknown>;
  submitted_at: string;
  status: string;
  submitted_by: string;
};

type FormRow = {
  id: string;
  title: string;
};

function toText(value: unknown) {
  if (Array.isArray(value)) return value.join('; ');
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value ?? '');
}

export function SupervisorQueuePage() {
  const { user, organizationId, role } = useAuth();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, SubmissionRow>>({});
  const [formsMap, setFormsMap] = useState<Record<string, string>>({});
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const fetchQueue = async () => {
    if (!user?.id || !organizationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data: assignmentsData, error: assignmentsError } = await supabase
      .from('submission_assignments')
      .select('id, submission_id, form_id, status, note, assigned_at')
      .eq('organization_id', organizationId)
      .eq('assigned_to', user.id)
      .order('assigned_at', { ascending: false })
      .returns<AssignmentRow[]>();

    if (assignmentsError) {
      setError(assignmentsError.message);
      setIsLoading(false);
      return;
    }

    const assignmentRows = assignmentsData ?? [];
    const submissionIds = assignmentRows.map((row) => row.submission_id);
    const formIds = Array.from(new Set(assignmentRows.map((row) => row.form_id).filter(Boolean) as string[]));

    const [submissionsRes, formsRes] = await Promise.all([
      submissionIds.length
        ? supabase
            .from('submissions')
            .select('id, payload, submitted_at, status, submitted_by')
            .in('id', submissionIds)
            .returns<SubmissionRow[]>()
        : Promise.resolve({ data: [], error: null }),
      formIds.length
        ? supabase
            .from('forms')
            .select('id, title')
            .in('id', formIds)
            .returns<FormRow[]>()
        : Promise.resolve({ data: [], error: null })
    ]);

    if (submissionsRes.error || formsRes.error) {
      setError(submissionsRes.error?.message || formsRes.error?.message || 'Failed to load queue details.');
      setIsLoading(false);
      return;
    }

    const submissionMap = (submissionsRes.data ?? []).reduce<Record<string, SubmissionRow>>((acc, submission) => {
      acc[submission.id] = submission;
      return acc;
    }, {});

    const nextFormsMap = (formsRes.data ?? []).reduce<Record<string, string>>((acc, form) => {
      acc[form.id] = form.title;
      return acc;
    }, {});

    setAssignments(assignmentRows);
    setSubmissionsMap(submissionMap);
    setFormsMap(nextFormsMap);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchQueue();
  }, [user?.id, organizationId]);

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? null,
    [assignments, selectedAssignmentId]
  );

  const selectedSubmission = selectedAssignment ? submissionsMap[selectedAssignment.submission_id] : null;

  const updateStatus = async (assignment: AssignmentRow, status: AssignmentRow['status']) => {
    const { error: assignError } = await supabase
      .from('submission_assignments')
      .update({ status })
      .eq('id', assignment.id);

    if (assignError) {
      addToast(assignError.message, 'error');
      return;
    }

    const submissionStatus = status === 'completed' ? 'reviewed' : status === 'flagged' ? 'flagged' : 'submitted';

    const { error: submissionError } = await supabase
      .from('submissions')
      .update({
        status: submissionStatus,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', assignment.submission_id);

    if (submissionError) {
      addToast(submissionError.message, 'error');
      return;
    }

    addToast(`Submission marked ${status}.`, 'success');
    await fetchQueue();
  };

  if (!role || !['supervisor', 'admin', 'owner', 'super_admin'].includes(role)) {
    return <div className="text-sm text-red-600">You do not have permission to view the review queue.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supervisor Review Queue</h1>
        <p className="text-gray-500">Only submissions assigned to you appear here.</p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load queue: {error}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Assigned</TableHeader>
                <TableHeader>Form</TableHeader>
                <TableHeader>Submitted</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => {
                const submission = submissionsMap[assignment.submission_id];
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>{new Date(assignment.assigned_at).toLocaleString()}</TableCell>
                    <TableCell>{assignment.form_id ? formsMap[assignment.form_id] || 'Unknown form' : 'No form'}</TableCell>
                    <TableCell>{submission ? new Date(submission.submitted_at).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          assignment.status === 'completed'
                            ? 'success'
                            : assignment.status === 'flagged'
                            ? 'danger'
                            : assignment.status === 'in_progress'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAssignmentId(assignment.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => void updateStatus(assignment, 'in_progress')}>
                          Start
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => void updateStatus(assignment, 'completed')}>
                          Complete
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => void updateStatus(assignment, 'flagged')}>
                          Flag
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!assignments.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-gray-500 py-10">
                    <div className="inline-flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      No submissions assigned to you yet.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignmentId(null)}
        title="Submission Detail"
        size="lg"
        footer={<Button variant="ghost" onClick={() => setSelectedAssignmentId(null)}>Close</Button>}
      >
        <div className="space-y-3">
          {selectedSubmission && Object.entries(selectedSubmission.payload || {}).map(([key, value]) => (
            <div key={key} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-xs uppercase font-semibold text-gray-500 mb-1">{key}</p>
              <p className="text-sm text-gray-900 break-words">{toText(value)}</p>
            </div>
          ))}

          {!selectedSubmission && <p className="text-sm text-gray-500">No payload available.</p>}
        </div>
      </Modal>
    </div>
  );
}

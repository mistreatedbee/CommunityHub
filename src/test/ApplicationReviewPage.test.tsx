import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationReviewPage } from '../pages/admin/ApplicationReviewPage';

const addToast = vi.fn();
const updateEq = vi.fn().mockResolvedValue({ error: null });
const upsertMock = vi.fn().mockResolvedValue({ error: null });
const maybeSingleMock = vi.fn().mockResolvedValue({
  data: {
    id: 'app-1',
    organization_id: 'org-1',
    user_id: 'user-1',
    applicant_name: 'Test User',
    applicant_email: 'test@example.com',
    phone: null,
    occupation: null,
    company: null,
    interests: [],
    reason: null,
    linkedin: null,
    status: 'pending',
    admin_note: null,
    created_at: new Date().toISOString()
  },
  error: null
});

vi.mock('../components/ui/Toast', () => ({
  useToast: () => ({ addToast })
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1' } })
}));

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'applications') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: maybeSingleMock
            })
          }),
          update: () => ({
            eq: updateEq
          })
        };
      }
      if (table === 'organization_memberships') {
        return {
          upsert: upsertMock
        };
      }
      return {};
    }
  }
}));

describe('ApplicationReviewPage', () => {
  it('upserts membership on approval', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/admin/applications/app-1']}>
        <Routes>
          <Route path="/admin/applications/:id" element={<ApplicationReviewPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Test User')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve application/i }));
    await user.click(screen.getByRole('button', { name: /confirm approval/i }));

    await waitFor(() => {
      expect(upsertMock).toHaveBeenCalled();
    });
  });
});

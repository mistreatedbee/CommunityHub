import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RequireRole } from '../components/auth/RequireRole';

const mockUseAuth = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('RequireRole', () => {
  it('renders children for allowed roles with org context', () => {
    mockUseAuth.mockReturnValue({
      role: 'member',
      loading: false,
      organizationId: 'org-1'
    });

    render(
      <MemoryRouter>
        <RequireRole roles={['member']}>
          <div>Protected Content</div>
        </RequireRole>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('blocks access when org context is missing', () => {
    mockUseAuth.mockReturnValue({
      role: 'member',
      loading: false,
      organizationId: null
    });

    render(
      <MemoryRouter>
        <RequireRole roles={['member']}>
          <div>Protected Content</div>
        </RequireRole>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

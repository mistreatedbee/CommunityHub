import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from '../pages/auth/RegisterPage';

const addToast = vi.fn();
const signUp = vi.fn().mockResolvedValue({ error: null });

vi.mock('../components/ui/Toast', () => ({
  useToast: () => ({ addToast })
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ organization: { name: 'Test Org' } })
}));

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp
    }
  }
}));

describe('RegisterPage', () => {
  it('prevents submit with weak password', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'abc');
    await user.type(screen.getByLabelText('Confirm Password'), 'abc');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(signUp).not.toHaveBeenCalled();
    expect(addToast).toHaveBeenCalled();
  });
});

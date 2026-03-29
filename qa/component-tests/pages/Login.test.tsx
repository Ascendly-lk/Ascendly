/**
 * Tests for the Login page component.
 * Mocks react-router-dom, AuthContext, and auth utilities.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ──────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' }),
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null, setUser: vi.fn() }),
}));

const mockLogin = vi.fn();
vi.mock('@/utils/auth', () => ({
  login: (...args: any[]) => mockLogin(...args),
  getRoleDashboardRoute: () => '/dashboard',
  signInWithGoogle: vi.fn(),
  completeProfile: vi.fn(),
}));

vi.mock('@/pages/auth/Login.css', () => ({}));

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ user: { id: 'u1', email: 'test@ascendly.test', role: 'startup' } });
  });

  const renderLogin = async () => {
    const { default: Login } = await import('@/pages/auth/Login.jsx');
    return render(
      <React.Suspense fallback={null}>
        <Login />
      </React.Suspense>
    );
  };

  it('renders email and password fields', async () => {
    await renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    // Use getByPlaceholderText to avoid ambiguity with the "Toggle password visibility" button
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('renders a submit button', async () => {
    await renderLogin();
    expect(
      screen.getByRole('button', { name: /sign in|log in|login/i })
    ).toBeInTheDocument();
  });

  it('shows validation error when email is missing', async () => {
    await renderLogin();
    const submitBtn = screen.getByRole('button', { name: /sign in|log in|login/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      const errors = screen.queryAllByText(/required|email/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('calls login() with correct credentials on submit', async () => {
    const user = userEvent.setup();
    await renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i);
    const passInput = screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in|log in|login/i });

    await user.type(emailInput, 'test@ascendly.test');
    await user.type(passInput, 'Password123!');
    await user.click(submitBtn);

    await waitFor(() => {
      // Login form calls login({ email, password }) as a single object
      expect(mockLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.stringMatching(/test@ascendly\.test/),
          password: expect.stringMatching(/Password123!/),
        })
      );
    });
  });

  it('has a link to the register page', async () => {
    await renderLogin();
    const registerLink = screen.queryByRole('link', { name: /register|sign up|create account/i });
    expect(registerLink).toBeInTheDocument();
  });
});

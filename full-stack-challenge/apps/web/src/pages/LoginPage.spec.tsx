import { fireEvent, screen, waitFor } from '@testing-library/react';
import { type InitialEntry, Route, Routes } from 'react-router-dom';
import {
  type AuthState,
  SESSION_EXPIRED_ERROR,
} from '../features/auth/authSlice';
import * as authApi from '../services/authApi';
import { httpError, renderWithProviders } from '../testing/renderWithProviders';
import { LoginPage } from './LoginPage';

vi.mock('../services/authApi');

const loggedOut: AuthState = {
  status: 'unauthenticated',
  user: null,
  loginPending: false,
  error: null,
};

function renderLogin(
  auth: Partial<AuthState> = {},
  route: InitialEntry = '/login',
) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/machines" element={<p>Machines page</p>} />
      <Route path="/monitoring-points" element={<p>Points page</p>} />
    </Routes>,
    { preloadedState: { auth: { ...loggedOut, ...auth } }, route },
  );
}

function fillAndSubmit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/^password/i), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('LoginPage', () => {
  beforeEach(() => vi.resetAllMocks());

  it('renders a labelled form under a single heading', () => {
    renderLogin();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password/i)).toBeTruthy();
  });

  it('validates required fields without calling the API', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
    const email = screen.getByLabelText(/email/i);
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toContain('helper-text');
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    renderLogin();
    fillAndSubmit('not-an-email', 'secret');
    expect(await screen.findByText('Enter a valid email address')).toBeTruthy();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('signs in and goes to the machines page', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      email: 'admin@dynapredict.com',
    });
    renderLogin();
    fillAndSubmit('  admin@dynapredict.com ', 'secret');

    expect(await screen.findByText('Machines page')).toBeTruthy();
    expect(authApi.login).toHaveBeenCalledWith({
      email: 'admin@dynapredict.com',
      password: 'secret',
    });
  });

  it('returns to the private page that redirected here', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      email: 'admin@dynapredict.com',
    });
    renderLogin(
      {},
      { pathname: '/login', state: { from: '/monitoring-points' } },
    );
    fillAndSubmit('admin@dynapredict.com', 'secret');
    expect(await screen.findByText('Points page')).toBeTruthy();
  });

  it('announces wrong credentials and stays on the page', async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      httpError(401, {
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
      }),
    );
    renderLogin();
    fillAndSubmit('admin@dynapredict.com', 'wrong');

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Invalid email or password');
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
  });

  it('disables the button while signing in', async () => {
    vi.mocked(authApi.login).mockReturnValue(new Promise(() => undefined));
    renderLogin();
    fillAndSubmit('admin@dynapredict.com', 'secret');

    const button = await screen.findByRole('button', { name: 'Signing in…' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('explains an expired session', () => {
    renderLogin({ error: SESSION_EXPIRED_ERROR });
    expect(screen.getByRole('alert').textContent).toContain(
      'Your session has expired',
    );
  });

  it('shows and hides the password', async () => {
    renderLogin();
    const password = screen.getByLabelText(/^password/i);
    expect(password.getAttribute('type')).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    await waitFor(() => expect(password.getAttribute('type')).toBe('text'));
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password.getAttribute('type')).toBe('password');
  });

  it('redirects a user who is already signed in', () => {
    renderLogin({ status: 'authenticated', user: { email: 'a@b.co' } });
    expect(screen.getByText('Machines page')).toBeTruthy();
  });
});

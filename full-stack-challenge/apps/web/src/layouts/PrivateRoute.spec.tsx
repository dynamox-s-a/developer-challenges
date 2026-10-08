import { screen } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import type { AuthState } from '../features/auth/authSlice';
import { renderWithProviders } from '../testing/renderWithProviders';
import { PrivateRoute } from './PrivateRoute';

function LoginProbe() {
  const location = useLocation();
  return <p>Login page from {String(location.state?.from)}</p>;
}

function renderAt(status: AuthState['status'], route = '/machines?page=2') {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginProbe />} />
      <Route element={<PrivateRoute />}>
        <Route path="/machines" element={<p>Private content</p>} />
      </Route>
    </Routes>,
    {
      route,
      preloadedState: {
        auth: {
          status,
          user: status === 'authenticated' ? { email: 'a@b.co' } : null,
          loginPending: false,
          error: null,
        },
      },
    },
  );
}

describe('PrivateRoute', () => {
  it('waits for the session check instead of redirecting', () => {
    renderAt('unknown');
    expect(
      screen.getByRole('status', { name: 'Checking your session' }),
    ).toBeTruthy();
    expect(screen.queryByText('Private content')).toBeNull();
    expect(screen.queryByText(/Login page/)).toBeNull();
  });

  it('sends a signed-out user to login, remembering the page', () => {
    renderAt('unauthenticated');
    expect(screen.getByText('Login page from /machines?page=2')).toBeTruthy();
    expect(screen.queryByText('Private content')).toBeNull();
  });

  it('renders the page for a signed-in user', () => {
    renderAt('authenticated');
    expect(screen.getByText('Private content')).toBeTruthy();
  });
});

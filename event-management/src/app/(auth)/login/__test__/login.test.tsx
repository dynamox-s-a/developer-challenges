import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('LoginPage Integration', () => {
  let store: ReturnType<typeof makeStore>;
  let mockPush: jest.Mock;

  beforeEach(() => {
    store = makeStore();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (global.fetch as jest.Mock).mockClear();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('dispatches login action, updates store and redirects on successful submit', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ email: 'admin@example.com', role: 'admin' }],
    });

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), '123456');

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/users?email=admin@example.com&password=123456');

      const state = store.getState();
      expect(state.auth.user.email).toBe('admin@example.com');

      expect(mockPush).toHaveBeenCalledWith('/events');
    });
  });

  it('shows error message on failed login', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users?email=wrong@example.com&password=wrongpass',
      );

      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

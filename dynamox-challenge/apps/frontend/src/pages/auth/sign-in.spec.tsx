import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignInPage from './sign-in';
import { vi } from 'vitest';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

// Mock Redux hooks to avoid Provider wrapper issues
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => selector({ auth: { isAuthenticated: false } }),
  };
});

// Mock the API hook
const mockLogin = vi.fn();
vi.mock('@/store/auth/auth.api', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignInPage', () => {
  const renderComponent = () => {
    return render(
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <SignInPage />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form correctly', () => {
    const { container } = renderComponent();
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce({
      unwrap: () => Promise.resolve({ token: 'fake-token' }),
    });

    const { container } = renderComponent();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@example.com' } });
    const passwordInput = container.querySelector('input[name="password"]');
    if (!passwordInput) throw new Error('Password input not found');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('handles login error', async () => {
    mockLogin.mockResolvedValueOnce({
      unwrap: () => Promise.reject({ status: 401 }),
    });

    const { container } = renderComponent();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'wrong@example.com' } });
    const passwordInput = container.querySelector('input[name="password"]');
    if (!passwordInput) throw new Error('Password input not found');
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});

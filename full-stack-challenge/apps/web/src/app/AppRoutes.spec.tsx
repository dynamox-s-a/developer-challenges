import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import type { AuthState } from '../features/auth/authSlice';
import * as authApi from '../services/authApi';
import * as machinesApi from '../services/machinesApi';
import * as monitoringPointsApi from '../services/monitoringPointsApi';
import { renderWithProviders } from '../testing/renderWithProviders';
import App from './app';

vi.mock('../services/authApi');
vi.mock('../services/machinesApi');
vi.mock('../services/monitoringPointsApi');

function resetApiMocks() {
  vi.resetAllMocks();
  // These tests only look at routing and the shell: the list stays loading,
  // so no response lands after a test has finished.
  const pending = () => new Promise<never>(() => undefined);
  vi.mocked(machinesApi.listMachines).mockReturnValue(pending());
  vi.mocked(machinesApi.getMachine).mockReturnValue(pending());
  vi.mocked(monitoringPointsApi.listMonitoringPoints).mockReturnValue(
    pending(),
  );
  vi.mocked(monitoringPointsApi.getMonitoringPoint).mockReturnValue(pending());
}

const signedIn: AuthState = {
  status: 'authenticated',
  user: { email: 'admin@dynapredict.com' },
  loginPending: false,
  error: null,
};

function renderApp(route: string, auth: AuthState = signedIn) {
  return renderWithProviders(<App />, {
    route,
    preloadedState: { auth, ui: { colorMode: 'light' } },
  });
}

function heading() {
  return screen.getByRole('heading', { level: 1 });
}

describe('App routes', () => {
  beforeEach(resetApiMocks);

  it('opens the machines page from the root', () => {
    renderApp('/');
    expect(heading().textContent).toBe('Machines');
  });

  it.each([
    ['/machines', 'Machines'],
    ['/monitoring-points', 'Monitoring points'],
    ['/nope', 'Page not found'],
  ])('renders %s inside the layout', (route, title) => {
    renderApp(route);
    expect(heading().textContent).toBe(title);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('opens a series page inside the layout', () => {
    renderApp('/monitoring-points/0b6c2f3e-1d4a-4c8b-9f7e-2a5d6c8e9f01/series');
    expect(
      screen.getByRole('status', { name: 'Loading monitoring point' }),
    ).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
  });

  it('opens a machine inside the layout', () => {
    renderApp('/machines/0b6c2f3e-1d4a-4c8b-9f7e-2a5d6c8e9f01');
    expect(
      screen.getByRole('status', { name: 'Loading machine' }),
    ).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
  });

  it('shows the login page at /login', () => {
    renderApp('/login', { ...signedIn, status: 'unauthenticated', user: null });
    expect(heading().textContent).toBe('Sign in');
  });

  it('keeps signed-out users out of private pages', () => {
    renderApp('/monitoring-points', {
      ...signedIn,
      status: 'unauthenticated',
      user: null,
    });
    expect(heading().textContent).toBe('Sign in');
  });
});

describe('AppLayout', () => {
  beforeEach(resetApiMocks);

  it('marks the current page in the navigation', () => {
    renderApp('/monitoring-points');
    const nav = screen.getAllByRole('navigation', { name: 'Main' })[0];
    const current = within(nav).getByRole('link', {
      name: 'Monitoring points',
    });
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(
      within(nav)
        .getByRole('link', { name: 'Machines' })
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('opens the mobile drawer and closes it after navigating', async () => {
    renderApp('/machines');
    const menu = screen.getByRole('button', { name: 'Open navigation' });
    expect(menu.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    const drawer = document.getElementById('mobile-navigation');
    expect(drawer).not.toBeNull();

    fireEvent.click(
      within(drawer as HTMLElement).getByRole('link', {
        name: 'Monitoring points',
      }),
    );
    expect(heading().textContent).toBe('Monitoring points');
    await waitFor(() =>
      expect(menu.getAttribute('aria-expanded')).toBe('false'),
    );
  });

  it('switches the colour mode', () => {
    const { store } = renderApp('/machines');
    fireEvent.click(screen.getByRole('button', { name: 'Use dark mode' }));
    expect(store.getState().ui.colorMode).toBe('dark');
    expect(screen.getByRole('button', { name: 'Use light mode' })).toBeTruthy();
  });

  it('signs out and returns to the login page', async () => {
    vi.mocked(authApi.logout).mockResolvedValue();
    renderApp('/machines');
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    await waitFor(() => expect(heading().textContent).toBe('Sign in'));
    expect(authApi.logout).toHaveBeenCalled();
  });

  it('offers a skip link to the main content', () => {
    renderApp('/machines');
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip.getAttribute('href')).toBe(`#${screen.getByRole('main').id}`);
  });
});

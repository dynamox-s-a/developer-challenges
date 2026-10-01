import { fireEvent, screen } from '@testing-library/react';
import { mockApi, operator, problem } from '../testing/mock-api';
import { renderApp, setScreen } from '../testing/render-app';

const loggedIn = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
  'GET /api/overview': () =>
    Response.json({
      sectors: 0,
      machines: 0,
      monitoringPoints: 0,
      sensors: 0,
      timeSeries: 0,
      readings: 0,
    }),
};

const SCREENS = ['Overview', 'Sectors', 'Machines', 'Monitoring points', 'CSV import'];

describe('application routes', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps every screen in a visible menu on a wide screen', async () => {
    setScreen('wide');
    mockApi(loggedIn);
    renderApp('/');

    const nav = await screen.findByRole('navigation', { name: 'Main navigation' });
    for (const label of SCREENS) {
      expect(nav).toHaveTextContent(label);
    }
    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
  });

  it('hides the menu behind a button on a narrow screen', async () => {
    setScreen('narrow');
    mockApi(loggedIn);
    renderApp('/');

    fireEvent.click(await screen.findByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders the screen of the current path', async () => {
    setScreen('wide');
    mockApi(loggedIn);
    renderApp('/import');

    expect(await screen.findByRole('heading', { name: 'CSV import' })).toBeInTheDocument();
  });

  it('answers an unknown path with a not found page', async () => {
    setScreen('wide');
    mockApi(loggedIn);
    renderApp('/no-such-screen');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('shows the API as online once the health check answers', async () => {
    setScreen('wide');
    mockApi(loggedIn);
    renderApp('/');

    expect(await screen.findByText('API: online')).toBeInTheDocument();
  });

  it('sends a visitor without a session to the login screen', async () => {
    setScreen('wide');
    mockApi({ 'GET /api/auth/me': () => problem(401, 'Authentication required.') });
    const { router } = renderApp('/import');

    expect(await screen.findByRole('heading', { name: 'Condition Monitor' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
  });

  it('shows nothing private while the API cannot be reached, and offers a retry', async () => {
    setScreen('wide');
    mockApi({ 'GET /api/auth/me': () => new Response('Bad Gateway', { status: 502 }) });
    renderApp('/import');

    expect(
      await screen.findByText('Could not reach the API to check the session.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'CSV import' })).not.toBeInTheDocument();
  });
});

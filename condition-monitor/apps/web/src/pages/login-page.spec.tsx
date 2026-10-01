import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockApi, noContent, operator, problem } from '../testing/mock-api';
import { renderApp, setScreen } from '../testing/render-app';

function fillAndSubmit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/Password/), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('login', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows field errors from the shared schema without calling the API', async () => {
    const { fetchMock } = mockApi({});
    renderApp('/login');

    fillAndSubmit('not an email', '');

    expect(await screen.findByText('Must be a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Required.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the message of the API when the credentials are wrong', async () => {
    mockApi({ 'POST /api/auth/login': () => problem(401, 'Invalid email or password.') });
    renderApp('/login');

    fillAndSubmit('operator@plant.test', 'wrong password');

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
  });

  it('puts the field errors the API answers on their fields', async () => {
    mockApi({
      'POST /api/auth/login': () =>
        problem(422, '1 field is invalid.', [
          { field: 'password', message: 'Rejected by the API.' },
        ]),
    });
    renderApp('/login');

    fillAndSubmit('operator@plant.test', 'something');

    expect(await screen.findByText('Rejected by the API.')).toBeInTheDocument();
  });

  it('logs in with a normalized email and returns to the screen first asked for', async () => {
    let session = false;
    const { calls } = mockApi({
      'GET /api/auth/me': () =>
        session ? Response.json(operator) : problem(401, 'Authentication required.'),
      'POST /api/auth/login': () => {
        session = true;
        return noContent();
      },
      'GET /api/health': () => Response.json({ status: 'ok' }),
    });
    const { router } = renderApp('/import');
    await screen.findByRole('button', { name: 'Sign in' });

    fillAndSubmit('  Operator@Plant.TEST ', 'correct horse battery');

    expect(await screen.findByRole('heading', { name: 'CSV import' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/import');
    expect(calls.find((call) => call.method === 'POST')?.body).toEqual({
      email: 'operator@plant.test',
      password: 'correct horse battery',
    });
  });

  it('logs out and goes back to the login screen', async () => {
    mockApi({
      'GET /api/auth/me': () => Response.json(operator),
      'GET /api/health': () => Response.json({ status: 'ok' }),
      'POST /api/auth/logout': noContent,
      'GET /api/overview': () =>
        Response.json({
          sectors: 0,
          machines: 0,
          monitoringPoints: 0,
          sensors: 0,
          timeSeries: 0,
          readings: 0,
        }),
    });
    const { router } = renderApp('/');

    fireEvent.click(await screen.findByRole('button', { name: 'Log out' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});

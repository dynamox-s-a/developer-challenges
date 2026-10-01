import type { MonitoringPoint, Page } from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
};

const FIRST_PAGE = 'GET /api/monitoring-points?page=1&pageSize=5&sort=machineName&order=asc';

const pump = { id: 'm-pump', tag: 'DRY-PUMP-01', name: 'Condensate pump', type: 'Pump' as const };
const fan = { id: 'm-fan', tag: 'DRY-FAN-01', name: 'Hood exhaust fan', type: 'Fan' as const };

const points: MonitoringPoint[] = [
  {
    id: 'p1',
    name: 'Motor, drive end bearing',
    location: 'PUMP_MOTOR_DE',
    machine: pump,
    sensor: { serialNumber: 'DX-0001', model: 'HF+' },
  },
  { id: 'f1', name: 'Casing', location: 'OTHER', machine: fan, sensor: null },
];

function page(items: MonitoringPoint[], total = items.length, number = 1): Page<MonitoringPoint> {
  return { items, total, page: number, pageSize: 5 };
}

function rows() {
  return within(screen.getByRole('table', { name: 'Monitoring points' }))
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    );
}

describe('monitoring points page', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the four required columns first, then the tag and the position', async () => {
    mockApi({ ...base, [FIRST_PAGE]: () => Response.json(page(points)) });
    renderApp('/monitoring-points');

    await screen.findByRole('table', { name: 'Monitoring points' });
    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);
    expect(headers).toEqual([
      'Machine Name',
      'Machine Type',
      'Monitoring Point Name',
      'Sensor Model',
      'Tag',
      'Position',
    ]);
    expect(rows()).toEqual([
      [
        'Condensate pump',
        'Pump',
        'Motor, drive end bearing',
        'HF+',
        'DRY-PUMP-01',
        'Motor, drive end bearing',
      ],
      ['Hood exhaust fan', 'Fan', 'Casing', 'No sensor', 'DRY-FAN-01', 'Other location'],
    ]);
  });

  it('asks the server to sort by a column, then in the other direction', async () => {
    const { calls } = mockApi({
      ...base,
      [FIRST_PAGE]: () => Response.json(page(points)),
      'GET /api/monitoring-points?page=1&pageSize=5&sort=sensorModel&order=asc': () =>
        Response.json(page(points)),
      'GET /api/monitoring-points?page=1&pageSize=5&sort=sensorModel&order=desc': () =>
        Response.json(page([...points].reverse())),
    });
    renderApp('/monitoring-points');
    await screen.findByRole('table', { name: 'Monitoring points' });

    fireEvent.click(screen.getByRole('button', { name: 'Sensor Model' }));
    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: 'Sensor Model' })).toHaveAttribute(
        'aria-sort',
        'ascending',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sensor Model' }));

    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: 'Sensor Model' })).toHaveAttribute(
        'aria-sort',
        'descending',
      ),
    );
    expect(calls.map((call) => call.path)).toContain(
      '/api/monitoring-points?page=1&pageSize=5&sort=sensorModel&order=desc',
    );
    await waitFor(() => expect(rows()[0][0]).toBe('Hood exhaust fan'));
  });

  it('loads the next page from the server, keeping the sort', async () => {
    mockApi({
      ...base,
      [FIRST_PAGE]: () => Response.json(page(points, 7)),
      'GET /api/monitoring-points?page=2&pageSize=5&sort=machineName&order=asc': () =>
        Response.json(page([{ ...points[1], id: 'f2', name: 'Inlet' }], 7, 2)),
    });
    renderApp('/monitoring-points');
    await screen.findByText(/^1\D5 of 7$/);

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(await screen.findByText(/^6\D7 of 7$/)).toBeInTheDocument();
    expect(rows().map((row) => row[2])).toEqual(['Inlet']);
  });

  it('offers no other page size than the 5 the challenge asks for', async () => {
    mockApi({ ...base, [FIRST_PAGE]: () => Response.json(page(points, 7)) });
    renderApp('/monitoring-points');
    await screen.findByText(/^1\D5 of 7$/);

    expect(screen.queryByText('Rows per page:')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('opens the point of a row, and the machine from its tag', async () => {
    mockApi({
      ...base,
      [FIRST_PAGE]: () => Response.json(page(points)),
      'GET /api/sectors': () => Response.json([]),
      'GET /api/monitoring-points/f1': () => new Response(null, { status: 404 }),
      'GET /api/monitoring-points/f1/time-series': () => new Response(null, { status: 404 }),
      'GET /api/machines/m-fan': () => new Response(null, { status: 404 }),
    });
    const { router } = renderApp('/monitoring-points');

    fireEvent.click(await screen.findByRole('cell', { name: 'Casing' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/monitoring-points/f1'));

    await router.navigate('/monitoring-points');
    fireEvent.click(await screen.findByRole('link', { name: 'DRY-FAN-01' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/machines/m-fan'));
  });

  it('points to the machines when there is no point yet', async () => {
    mockApi({ ...base, [FIRST_PAGE]: () => Response.json(page([])) });
    renderApp('/monitoring-points');

    expect(await screen.findByText(/No monitoring points yet/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open a machine' })).toHaveAttribute(
      'href',
      '/machines',
    );
  });

  it('offers a retry when the list fails', async () => {
    let fail = true;
    mockApi({
      ...base,
      [FIRST_PAGE]: () =>
        fail ? problem(500, 'Could not load the monitoring points.') : Response.json(page(points)),
    });
    renderApp('/monitoring-points');

    expect(await screen.findByText('Could not load the monitoring points.')).toBeInTheDocument();
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('table', { name: 'Monitoring points' })).toBeInTheDocument();
  });
});

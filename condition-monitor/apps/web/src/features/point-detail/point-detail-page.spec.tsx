import type {
  MonitoringPoint,
  ReadingsAnswer,
  SeriesMetrics,
  TimeSeriesSummary,
} from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, noContent, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

// jsdom has no canvas: the chart becomes a list of its lines and their point counts.
vi.mock('react-chartjs-2', () => ({
  Line: (props: {
    'aria-label': string;
    data: { datasets: { label: string; data: unknown[] }[] };
  }) => (
    <div role="img" aria-label={props['aria-label']}>
      {props.data.datasets.map((dataset) => `${dataset.label}: ${dataset.data.length}`).join('; ')}
    </div>
  ),
}));

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
};

const point: MonitoringPoint = {
  id: 'p1',
  name: 'Motor, drive end bearing',
  location: 'PUMP_MOTOR_DE',
  machine: { id: 'm1', tag: 'DRY-PUMP-01', name: 'Condensate pump', type: 'Pump' },
  sensor: { serialNumber: 'DX-000001', model: 'HF+' },
};

function summary(
  id: string,
  quantity: TimeSeriesSummary['quantity'],
  axis: TimeSeriesSummary['axis'],
  label: string,
  unit: string,
): TimeSeriesSummary {
  return {
    id,
    monitoringPointId: 'p1',
    quantity,
    axis,
    unit,
    label,
    readingCount: 144,
    firstTimestamp: '2026-09-28T00:00:00.000Z',
    lastTimestamp: '2026-09-28T23:50:00.000Z',
  };
}

const series = [
  summary('vh', 'velocity_rms', 'H', 'Velocity RMS, horizontal', 'mm/s'),
  summary('vv', 'velocity_rms', 'V', 'Velocity RMS, vertical', 'mm/s'),
  summary('t', 'temperature', null, 'Temperature', '°C'),
];

const metrics: SeriesMetrics = {
  count: 144,
  min: 1.8,
  max: 2.2,
  mean: 2.0,
  stdDev: 0.1,
  rms: 2.0025,
  firstTimestamp: '2026-09-28T00:00:00.000Z',
  lastTimestamp: '2026-09-28T23:50:00.000Z',
};

const empty: SeriesMetrics = {
  count: 0,
  min: null,
  max: null,
  mean: null,
  stdDev: null,
  rms: null,
  firstTimestamp: null,
  lastTimestamp: null,
};

const readings: ReadingsAnswer = {
  downsampled: false,
  readings: [
    { timestamp: '2026-09-28T00:00:00.000Z', value: 1.8 },
    { timestamp: '2026-09-28T00:10:00.000Z', value: 1.9 },
  ],
};

/** Routes for every series of the point, over the whole period unless a query is given. */
function dataRoutes(query = '', answer: ReadingsAnswer = readings, metricsOf = () => metrics) {
  const maxPoints = query ? `${query}&maxPoints=1000` : '?maxPoints=1000';
  return Object.fromEntries(
    series.flatMap((item) => [
      [`GET /api/time-series/${item.id}/metrics${query}`, () => Response.json(metricsOf())],
      [`GET /api/time-series/${item.id}/readings${maxPoints}`, () => Response.json(answer)],
    ]),
  );
}

const pointRoutes = {
  'GET /api/monitoring-points/p1': () => Response.json(point),
  'GET /api/monitoring-points/p1/time-series': () => Response.json(series),
};

describe('monitoring point page', () => {
  // The route loads the page on demand. Loading it once here keeps the first test from
  // waiting on the module transform, which under a busy machine outlasts a query's wait.
  beforeAll(async () => {
    await import('./point-detail-page');
  }, 30_000);

  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the point, one chart per quantity with a line per axis, and the metrics', async () => {
    mockApi({ ...base, ...pointRoutes, ...dataRoutes() });
    renderApp('/monitoring-points/p1');

    expect(
      await screen.findByRole('heading', { name: 'Motor, drive end bearing' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'DRY-PUMP-01' })).toHaveAttribute(
      'href',
      '/machines/m1',
    );
    expect(screen.getByText(/Sensor DX-000001 \(HF\+\)/)).toBeInTheDocument();

    expect(
      await screen.findByRole('img', { name: 'Velocity RMS chart, in mm/s' }),
    ).toHaveTextContent('Velocity RMS, horizontal: 2; Velocity RMS, vertical: 2');
    expect(screen.getByRole('img', { name: 'Temperature chart, in °C' })).toHaveTextContent(
      'Temperature: 2',
    );

    const table = screen.getByRole('table', { name: 'Velocity RMS metrics' });
    const cells = within(within(table).getAllByRole('row')[1]).getAllByRole('cell');
    expect(cells.slice(0, 7).map((cell) => cell.textContent)).toEqual([
      'Velocity RMS, horizontal',
      '144',
      '1.8',
      '2.2',
      '2',
      '0.1',
      '2.003',
    ]);
  });

  it('shows n/a, never zero, for a period without readings (C7)', async () => {
    mockApi({ ...base, ...pointRoutes, ...dataRoutes('', readings, () => empty) });
    renderApp('/monitoring-points/p1');

    const table = await screen.findByRole('table', { name: 'Temperature metrics' });
    await waitFor(() =>
      expect(
        within(within(table).getAllByRole('row')[1])
          .getAllByRole('cell')
          .slice(1, 7)
          .map((cell) => cell.textContent),
      ).toEqual(['0', 'n/a', 'n/a', 'n/a', 'n/a', 'n/a']),
    );
  });

  it('asks for the last 24 h ending at the latest reading, not at the current time', async () => {
    const day = '?from=2026-09-27T23%3A50%3A00.000Z&to=2026-09-28T23%3A50%3A00.000Z';
    const { calls } = mockApi({ ...base, ...pointRoutes, ...dataRoutes(), ...dataRoutes(day) });
    renderApp('/monitoring-points/p1');
    await screen.findByRole('img', { name: 'Temperature chart, in °C' });

    fireEvent.click(screen.getByRole('button', { name: 'Last 24 h' }));

    await waitFor(() =>
      expect(calls.map((call) => call.path)).toContain(`/api/time-series/t/metrics${day}`),
    );
    expect(screen.getByText('Ending at the latest reading of the point.')).toBeInTheDocument();
  });

  it('says when a chart is condensed into minimum and maximum', async () => {
    mockApi({
      ...base,
      ...pointRoutes,
      ...dataRoutes('', {
        downsampled: true,
        buckets: [
          {
            start: '2026-09-28T00:00:00.000Z',
            end: '2026-09-28T12:00:00.000Z',
            min: 1,
            max: 3,
            count: 72,
          },
        ],
      }),
    });
    renderApp('/monitoring-points/p1');

    expect((await screen.findAllByText(/Condensed for display/)).length).toBe(2);
  });

  it('deletes a series after confirming, then reloads the point', async () => {
    let deleted = false;
    const { calls } = mockApi({
      ...base,
      'GET /api/monitoring-points/p1': () => Response.json(point),
      'GET /api/monitoring-points/p1/time-series': () =>
        Response.json(deleted ? series.filter((item) => item.id !== 'vv') : series),
      ...dataRoutes(),
      'DELETE /api/time-series/vv': () => {
        deleted = true;
        return noContent();
      },
    });
    renderApp('/monitoring-points/p1');
    fireEvent.click(await screen.findByRole('button', { name: 'Delete Velocity RMS, vertical' }));

    expect(
      screen.getByText(/Velocity RMS, vertical and its 144 readings will be removed/),
    ).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Delete Velocity RMS, vertical' }),
      ).not.toBeInTheDocument(),
    );
    expect(calls.some((call) => call.method === 'DELETE')).toBe(true);
  });

  it('points to the import while the point has no series', async () => {
    mockApi({
      ...base,
      'GET /api/monitoring-points/p1': () => Response.json(point),
      'GET /api/monitoring-points/p1/time-series': () => Response.json([]),
    });
    renderApp('/monitoring-points/p1');

    expect(await screen.findByText(/No readings stored for this point yet/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Import a CSV file' })).toHaveAttribute(
      'href',
      '/import',
    );
  });

  it('shows the API message for a point that does not exist', async () => {
    mockApi({
      ...base,
      'GET /api/monitoring-points/p1': () => problem(404, 'Monitoring point not found.'),
      'GET /api/monitoring-points/p1/time-series': () =>
        problem(404, 'Monitoring point not found.'),
    });
    renderApp('/monitoring-points/p1');

    expect(await screen.findByText('Monitoring point not found.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  describe('forecast', () => {
    const forecast = (error: number, baselineError: number) => ({
      status: 'available',
      basedOn: { from: '2026-09-18T00:00:00.000Z', to: '2026-09-29T00:00:00.000Z', hours: 264 },
      validation: { forecasts: 30, error, baselineError },
      points: Array.from({ length: 24 }, (_, hour) => ({
        timestamp: new Date(Date.UTC(2026, 8, 29, hour, 30)).toISOString(),
        value: 2,
        lower: 1.8,
        upper: 2.2,
      })),
    });

    const forecastRoutes = {
      'GET /api/time-series/vh/forecast': () => Response.json(forecast(0.055, 0.077)),
      'GET /api/time-series/vv/forecast': () => Response.json(forecast(0.09, 0.08)),
      'GET /api/time-series/t/forecast': () =>
        Response.json({
          status: 'unavailable',
          reason: 'not-enough-history',
          detail: 'The series has 47 hours of continuous history; a forecast needs 168.',
        }),
    };

    it('is not asked for until the switch is turned on', async () => {
      const { calls } = mockApi({ ...base, ...pointRoutes, ...dataRoutes() });
      renderApp('/monitoring-points/p1');
      await screen.findByRole('img', { name: 'Temperature chart, in °C' });

      expect(calls.some((call) => call.path.endsWith('/forecast'))).toBe(false);
      expect(screen.getByRole('checkbox', { name: 'Forecast the next 24 h' })).not.toBeChecked();
    });

    it('adds the dashed line and its band to the chart, and says what the forecast is worth', async () => {
      mockApi({ ...base, ...pointRoutes, ...dataRoutes(), ...forecastRoutes });
      renderApp('/monitoring-points/p1');
      fireEvent.click(await screen.findByRole('checkbox', { name: 'Forecast the next 24 h' }));

      const notes = await screen.findByRole('list', { name: 'Velocity RMS forecast' });
      expect(screen.getByRole('img', { name: 'Velocity RMS chart, in mm/s' })).toHaveTextContent(
        'Velocity RMS, horizontal, forecast: 24',
      );
      expect(within(notes).getAllByRole('listitem')[0]).toHaveTextContent(
        "Velocity RMS, horizontal: missed by 0.055 mm/s on average; repeating yesterday's hour misses by 0.077 mm/s.",
      );
    });

    it('warns when a forecast is not better than repeating yesterday', async () => {
      mockApi({ ...base, ...pointRoutes, ...dataRoutes(), ...forecastRoutes });
      renderApp('/monitoring-points/p1');
      fireEvent.click(await screen.findByRole('checkbox', { name: 'Forecast the next 24 h' }));

      const notes = await screen.findByRole('list', { name: 'Velocity RMS forecast' });
      expect(within(notes).getAllByRole('listitem')[1]).toHaveTextContent(
        'Not better than repeating yesterday: do not rely on it.',
      );
      expect(within(notes).getAllByRole('listitem')[0]).not.toHaveTextContent('Not better');
    });

    it('says why a series has no forecast, and draws none for it', async () => {
      mockApi({ ...base, ...pointRoutes, ...dataRoutes(), ...forecastRoutes });
      renderApp('/monitoring-points/p1');
      fireEvent.click(await screen.findByRole('checkbox', { name: 'Forecast the next 24 h' }));

      const notes = await screen.findByRole('list', { name: 'Temperature forecast' });
      expect(notes).toHaveTextContent(
        'Temperature: no forecast. The series has 47 hours of continuous history; a forecast needs 168.',
      );
      expect(screen.getByRole('img', { name: 'Temperature chart, in °C' })).toHaveTextContent(
        /^Temperature: 2$/,
      );
    });
  });

  it('opens from the point name on the machine page', async () => {
    mockApi({
      ...base,
      ...pointRoutes,
      ...dataRoutes(),
      'GET /api/sectors': () => Response.json([]),
      'GET /api/machines/m1': () =>
        Response.json({
          ...point.machine,
          number: 1,
          sector: { id: 's1', code: 'DRY', name: 'Drying' },
          monitoringPoints: [point],
          counts: { monitoringPoints: 1, sensors: 1 },
        }),
    });
    renderApp('/machines/m1');

    fireEvent.click(await screen.findByRole('link', { name: 'Motor, drive end bearing' }));

    expect(
      await screen.findByRole('heading', { name: 'Motor, drive end bearing' }),
    ).toBeInTheDocument();
  });
});

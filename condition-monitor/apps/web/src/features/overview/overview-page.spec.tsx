import type { Overview } from '@condition-monitor/shared';
import { fireEvent, screen, within } from '@testing-library/react';
import { mockApi, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
};

const counts: Overview = {
  sectors: 1,
  machines: 4,
  monitoringPoints: 17,
  sensors: 15,
  timeSeries: 105,
  readings: 241_920,
};

function cards() {
  return within(screen.getByRole('list', { name: 'Stored counts' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent);
}

describe('overview page', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows every count, the number of time-series among them', async () => {
    mockApi({ ...base, 'GET /api/overview': () => Response.json(counts) });
    renderApp('/');

    await screen.findByRole('list', { name: 'Stored counts' });

    expect(cards()).toEqual([
      'Sectors1',
      'Machines4',
      'Monitoring points17',
      'Sensors15on 15 of 17 points',
      'Time-series105',
      'Readings241,920',
    ]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('links each count to the screen where it is managed', async () => {
    mockApi({ ...base, 'GET /api/overview': () => Response.json(counts) });
    renderApp('/');

    expect(await screen.findByRole('link', { name: 'Machines' })).toHaveAttribute(
      'href',
      '/machines',
    );
    expect(
      within(screen.getByRole('list', { name: 'Stored counts' })).getByRole('link', {
        name: 'Readings',
      }),
    ).toHaveAttribute('href', '/import');
  });

  it('points to the machines while there is no monitoring point', async () => {
    mockApi({
      ...base,
      'GET /api/overview': () =>
        Response.json({
          ...counts,
          machines: 1,
          monitoringPoints: 0,
          sensors: 0,
          timeSeries: 0,
          readings: 0,
        }),
    });
    renderApp('/');

    expect(await screen.findByText(/No monitoring points yet/)).toBeInTheDocument();
    // No coverage note without points to cover.
    expect(cards()[3]).toBe('Sensors0');
  });

  it('points to the import once sensors exist but no reading does', async () => {
    mockApi({
      ...base,
      'GET /api/overview': () => Response.json({ ...counts, timeSeries: 0, readings: 0 }),
    });
    renderApp('/');

    expect(await screen.findByRole('link', { name: 'Import a CSV file' })).toHaveAttribute(
      'href',
      '/import',
    );
  });

  it('offers a retry when the counts cannot be loaded', async () => {
    let fail = true;
    mockApi({
      ...base,
      'GET /api/overview': () =>
        fail ? problem(500, 'Could not load the overview.') : Response.json(counts),
    });
    renderApp('/');

    expect(await screen.findByText('Could not load the overview.')).toBeInTheDocument();
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('list', { name: 'Stored counts' })).toBeInTheDocument();
  });
});

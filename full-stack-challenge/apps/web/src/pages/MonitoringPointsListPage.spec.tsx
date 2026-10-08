import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { DEFAULT_MONITORING_POINTS_QUERY } from '../features/monitoringPoints/monitoringPointsSlice';
import * as monitoringPointsApi from '../services/monitoringPointsApi';
import { aPage, aPointListItem, aSensor } from '../testing/fixtures';
import { renderWithProviders } from '../testing/renderWithProviders';
import { MonitoringPointsListPage } from './MonitoringPointsListPage';

vi.mock('../services/monitoringPointsApi');

const withSensor = aPointListItem({
  id: 'p-1',
  name: 'Bearing DE',
  machine: { id: 'm-1', name: 'Pump 01', type: 'Pump' },
  sensor: aSensor({ serialNumber: 'HFP-0001', model: 'HF+' }),
});
const withoutSensor = aPointListItem({
  id: 'p-2',
  name: 'Motor NDE',
  machine: { id: 'm-2', name: 'Fan 02', type: 'Fan' },
  sensor: null,
});

function renderPage() {
  return renderWithProviders(<MonitoringPointsListPage />, {
    route: '/monitoring-points',
  });
}

function lastQuery() {
  return vi.mocked(monitoringPointsApi.listMonitoringPoints).mock.lastCall?.[0];
}

async function rowOf(pointName: string) {
  return (await screen.findByText(pointName)).closest('tr') as HTMLElement;
}

describe('MonitoringPointsListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(monitoringPointsApi.listMonitoringPoints).mockResolvedValue(
      aPage([withSensor, withoutSensor], {
        pageSize: 5,
        total: 12,
        totalPages: 3,
      }),
    );
  });

  it('loads the first page of 5, sorted by machine name', async () => {
    renderPage();
    await rowOf('Bearing DE');
    expect(lastQuery()).toEqual(DEFAULT_MONITORING_POINTS_QUERY);
    expect(screen.getByText('1–5 of 12')).toBeTruthy();
    expect(
      screen
        .getByRole('columnheader', { name: 'Machine' })
        .getAttribute('aria-sort'),
    ).toBe('ascending');
  });

  it('shows the machine, the point and its sensor', async () => {
    renderPage();
    const row = await rowOf('Bearing DE');
    expect(
      within(row).getByRole('link', { name: 'Pump 01' }).getAttribute('href'),
    ).toBe('/machines/m-1');
    expect(within(row).getByText('Pump')).toBeTruthy();
    expect(within(row).getByText('HF+')).toBeTruthy();
    expect(within(row).getByText('HFP-0001')).toBeTruthy();
    expect(
      within(row)
        .getByRole('link', { name: 'View series of Bearing DE on Pump 01' })
        .getAttribute('href'),
    ).toBe('/monitoring-points/p-1/series');
  });

  it('says so, in text, when a point has no sensor', async () => {
    renderPage();
    const row = await rowOf('Motor NDE');
    expect(within(row).getAllByText('No sensor')).toHaveLength(3);
    expect(within(row).queryByRole('link', { name: /series/i })).toBeNull();
  });

  it.each([
    ['Machine type', 'machineType'],
    ['Monitoring point', 'pointName'],
    ['Sensor model', 'sensorModel'],
  ])('sorts by %s on the server, both ways', async (header, sortBy) => {
    renderPage();
    await rowOf('Bearing DE');

    fireEvent.click(screen.getByRole('button', { name: header }));
    await waitFor(() =>
      expect(lastQuery()).toEqual({
        ...DEFAULT_MONITORING_POINTS_QUERY,
        sortBy,
        sortDir: 'asc',
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: header }));
    await waitFor(() =>
      expect(lastQuery()).toEqual({
        ...DEFAULT_MONITORING_POINTS_QUERY,
        sortBy,
        sortDir: 'desc',
      }),
    );
  });

  it('flips the default machine sort to descending', async () => {
    renderPage();
    await rowOf('Bearing DE');
    fireEvent.click(screen.getByRole('button', { name: 'Machine' }));
    await waitFor(() => expect(lastQuery()?.sortDir).toBe('desc'));
  });

  it('pages on the server', async () => {
    renderPage();
    await rowOf('Bearing DE');

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(lastQuery()?.page).toBe(2));

    fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page' }), {
      target: { value: '10' },
    });
    await waitFor(() =>
      expect(lastQuery()).toMatchObject({ page: 1, pageSize: 10 }),
    );
  });

  it('explains an empty listing', async () => {
    vi.mocked(monitoringPointsApi.listMonitoringPoints).mockResolvedValue(
      aPage([], { total: 0, totalPages: 0 }),
    );
    renderPage();
    expect(
      await screen.findByText(
        'No monitoring points yet. Open a machine to add one.',
      ),
    ).toBeTruthy();
  });
});

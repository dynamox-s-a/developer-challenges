import type {
  MonitoringPointListItemDto,
  ReadingDto,
} from '@dynapredict/shared-types';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import * as monitoringPointsApi from '../services/monitoringPointsApi';
import * as readingsApi from '../services/readingsApi';
import { aPointListItem, aSensor } from '../testing/fixtures';
import { httpError, renderWithProviders } from '../testing/renderWithProviders';
import { fromLocalInputValue } from '../utils/format';
import { SeriesPage } from './SeriesPage';

vi.mock('../services/monitoringPointsApi');
vi.mock('../services/readingsApi');

const START = Date.UTC(2026, 9, 1, 12);
const series: ReadingDto[] = [1, 3, 2].map((value, i) => ({
  timestamp: new Date(START + i * 300_000).toISOString(),
  value,
}));

const point = aPointListItem({
  id: 'p-1',
  name: 'Bearing DE',
  machine: { id: 'm-1', name: 'Pump 01', type: 'Pump' },
  sensor: aSensor({ id: 's-1', serialNumber: 'HFP-0001', model: 'HF+' }),
});

const metrics = {
  count: 3,
  min: 1,
  max: 3,
  avg: 2,
  firstTimestamp: series[0].timestamp,
  lastTimestamp: series[2].timestamp,
};

const prediction = {
  data: [{ timestamp: new Date(START + 900_000).toISOString(), value: 2 }],
  meta: { method: 'movingAverage' as const, window: 5, used: 3, horizon: 1 },
};

function renderPage(target: MonitoringPointListItemDto = point) {
  vi.mocked(monitoringPointsApi.getMonitoringPoint).mockResolvedValue(target);
  return renderWithProviders(
    <Routes>
      <Route path="/monitoring-points/:id/series" element={<SeriesPage />} />
    </Routes>,
    { route: `/monitoring-points/${target.id}/series` },
  );
}

async function metricValue(label: string) {
  const list = await screen.findByLabelText('Series metrics');
  const term = within(list).getByText(label);
  return term.nextElementSibling?.textContent;
}

function chooseFile(name: string, content: string) {
  const file = new File([content], name, { type: 'text/csv' });
  // jsdom lacks Blob.text(), which every current browser has.
  Object.defineProperty(file, 'text', { value: async () => content });
  fireEvent.change(screen.getByLabelText(/choose file/i), {
    target: { files: [file] },
  });
}

describe('SeriesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(readingsApi.listReadings).mockResolvedValue({
      data: series,
      meta: { limit: 5000, nextCursor: null },
    });
    vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
    vi.mocked(readingsApi.getPrediction).mockResolvedValue(prediction);
  });

  it('shows the point, its metrics, the chart and the forecast', async () => {
    renderPage();
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Bearing DE' }),
    ).toBeTruthy();
    expect(
      screen.getByText(/Sensor HFP-0001 \(HF\+\) · Pump Pump 01/),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Pump 01' }).getAttribute('href'),
    ).toBe('/machines/m-1');

    expect(await metricValue('Readings')).toBe('3');
    expect(await metricValue('Average')).toBe('2');
    expect(
      await screen.findByText(
        /Line chart of 3 readings .* forecast of 1 point/,
      ),
    ).toBeTruthy();
    expect(
      await screen.findByText(
        /Moving average forecast of 1 point from the last 3 readings/,
      ),
    ).toBeTruthy();
    expect(readingsApi.listReadings).toHaveBeenCalledWith('s-1', {
      after: undefined,
      limit: 5000,
    });
  });

  it('explains a point without a sensor', async () => {
    renderPage(aPointListItem({ sensor: null }));
    expect(
      await screen.findByText(
        /This point has no sensor, so it has no readings/,
      ),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Add a sensor on the machine page' })
        .getAttribute('href'),
    ).toBe('/machines/m-1');
    expect(readingsApi.listReadings).not.toHaveBeenCalled();
  });

  it('says when the point does not exist', async () => {
    vi.mocked(monitoringPointsApi.getMonitoringPoint).mockRejectedValue(
      httpError(404, { error: { code: 'NOT_FOUND', message: 'Not found' } }),
    );
    renderWithProviders(
      <Routes>
        <Route path="/monitoring-points/:id/series" element={<SeriesPage />} />
      </Routes>,
      { route: '/monitoring-points/missing/series' },
    );
    expect(
      await screen.findByRole('heading', {
        name: 'Monitoring point not found',
      }),
    ).toBeTruthy();
  });

  it('explains that a forecast needs two readings', async () => {
    vi.mocked(readingsApi.getPrediction).mockRejectedValue(
      httpError(422, {
        error: {
          code: 'BUSINESS_RULE_VIOLATION',
          message: 'A prediction needs at least 2 readings',
        },
      }),
    );
    renderPage();
    expect(
      await screen.findByText(/A forecast needs at least 2 readings/),
    ).toBeTruthy();
  });

  describe('time range', () => {
    it('filters the series and the metrics', async () => {
      renderPage();
      await metricValue('Readings');
      fireEvent.change(screen.getByLabelText('From'), {
        target: { value: '2026-10-01T09:00' },
      });
      fireEvent.change(screen.getByLabelText('To'), {
        target: { value: '2026-10-01T10:00' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

      const range = {
        from: fromLocalInputValue('2026-10-01T09:00'),
        to: fromLocalInputValue('2026-10-01T10:00', true),
      };
      await waitFor(() =>
        expect(readingsApi.getReadingsMetrics).toHaveBeenLastCalledWith(
          's-1',
          range,
        ),
      );
      expect(range.to.endsWith(':59.999Z')).toBe(true);
      expect(
        await screen.findByRole('button', { name: 'Delete range' }),
      ).toBeTruthy();
    });

    it('rejects a range that ends before it starts', async () => {
      renderPage();
      await metricValue('Readings');
      fireEvent.change(screen.getByLabelText('From'), {
        target: { value: '2026-10-02T00:00' },
      });
      fireEvent.change(screen.getByLabelText('To'), {
        target: { value: '2026-10-01T00:00' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(
        await screen.findByText('"From" must not be after "To"'),
      ).toBeTruthy();
      expect(readingsApi.getReadingsMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('upload', () => {
    it('checks the file, sends it and reports what was stored', async () => {
      vi.mocked(readingsApi.createReadings).mockResolvedValue({
        received: 2,
        inserted: 1,
        duplicates: 1,
      });
      renderPage();
      await metricValue('Readings');

      chooseFile(
        'series.csv',
        'timestamp,value\n2026-10-01T13:00:00Z,4\n2026-10-01T13:05:00Z,5\n',
      );
      expect(
        await screen.findByText('series.csv: 2 readings ready to upload.'),
      ).toBeTruthy();
      fireEvent.click(
        screen.getByRole('button', { name: 'Upload 2 readings' }),
      );

      await waitFor(() =>
        expect(readingsApi.createReadings).toHaveBeenCalledWith('s-1', [
          { timestamp: '2026-10-01T13:00:00.000Z', value: 4 },
          { timestamp: '2026-10-01T13:05:00.000Z', value: 5 },
        ]),
      );
      expect(
        await screen.findByText(
          'series.csv: 1 new reading stored, 1 duplicate skipped.',
        ),
      ).toBeTruthy();
    });

    it('lists invalid lines and refuses to send the file', async () => {
      renderPage();
      await metricValue('Readings');
      chooseFile('bad.csv', 'timestamp,value\nyesterday,1\n');
      expect(
        await screen.findByText('Line 2: invalid timestamp "yesterday"'),
      ).toBeTruthy();
      expect(
        (screen.getByRole('button', { name: 'Upload' }) as HTMLButtonElement)
          .disabled,
      ).toBe(true);
      expect(readingsApi.createReadings).not.toHaveBeenCalled();
    });

    it('says how far a failed upload got and that retrying is safe', async () => {
      vi.mocked(readingsApi.createReadings).mockRejectedValue(
        httpError(500, {
          error: { code: 'INTERNAL', message: 'Server error' },
        }),
      );
      renderPage();
      await metricValue('Readings');
      chooseFile('series.csv', '2026-10-01T13:00:00Z,4\n');
      fireEvent.click(
        await screen.findByRole('button', { name: 'Upload 1 reading' }),
      );
      expect(
        await screen.findByText(
          /The upload stopped after 0 readings: Server error\. .* safe\./,
        ),
      ).toBeTruthy();
    });
  });

  describe('forecast settings', () => {
    it('asks for the chosen method, window and horizon', async () => {
      renderPage();
      await metricValue('Readings');
      fireEvent.change(screen.getByLabelText('Method'), {
        target: { value: 'linearRegression' },
      });
      fireEvent.change(screen.getByLabelText('Window (readings)'), {
        target: { value: '50' },
      });
      fireEvent.change(screen.getByLabelText('Horizon (points)'), {
        target: { value: '30' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Update forecast' }));

      await waitFor(() =>
        expect(readingsApi.getPrediction).toHaveBeenLastCalledWith('s-1', {
          method: 'linearRegression',
          window: 50,
          horizon: 30,
        }),
      );
    });

    it('validates the window bounds', async () => {
      renderPage();
      await metricValue('Readings');
      fireEvent.change(screen.getByLabelText('Window (readings)'), {
        target: { value: '1' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Update forecast' }));
      expect(
        await screen.findByText('Window must be a whole number from 2 to 1000'),
      ).toBeTruthy();
      expect(readingsApi.getPrediction).toHaveBeenCalledTimes(1);
    });
  });

  it('deletes the whole series after confirming the count', async () => {
    vi.mocked(readingsApi.deleteReadings).mockResolvedValue(3);
    renderPage();
    await metricValue('Readings');

    fireEvent.click(await screen.findByRole('button', { name: 'Delete all' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Delete readings?',
    });
    expect(dialog.textContent).toContain(
      '3 readings of sensor HFP-0001 will be permanently deleted.',
    );
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    await waitFor(() =>
      expect(readingsApi.deleteReadings).toHaveBeenCalledWith('s-1', {}),
    );
    expect(await screen.findByText('Readings deleted.')).toBeTruthy();
  });
});

import {
  MAX_READINGS_PAGE_SIZE,
  type ReadingDto,
  type ReadingsMetricsDto,
  type ReadingsPageDto,
} from '@dynapredict/shared-types';
import { setupStore } from '../../app/store';
import * as readingsApi from '../../services/readingsApi';
import { deferred } from '../../testing/fixtures';
import { httpError } from '../../testing/renderWithProviders';
import { logout } from '../auth/authSlice';
import {
  DEFAULT_PREDICTION_QUERY,
  deleteReadings,
  loadPrediction,
  loadReadings,
  MAX_CHART_POINTS,
  predictionQueryChanged,
  rangeChanged,
  selectSensorReadings,
  uploadReadings,
} from './readingsSlice';

vi.mock('../../services/readingsApi');
vi.mock('../../services/authApi');

const SENSOR = 's-1';
const START = Date.UTC(2026, 9, 1);

function readings(count: number, offset = 0): ReadingDto[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(START + (offset + i) * 60_000).toISOString(),
    value: offset + i,
  }));
}

function page(data: ReadingDto[], hasMore: boolean): ReadingsPageDto {
  return {
    data,
    meta: {
      limit: MAX_READINGS_PAGE_SIZE,
      nextCursor: hasMore ? (data.at(-1)?.timestamp ?? null) : null,
    },
  };
}

const metrics: ReadingsMetricsDto = {
  count: 3,
  min: 0,
  max: 2,
  avg: 1,
  firstTimestamp: readings(1)[0].timestamp,
  lastTimestamp: readings(1, 2)[0].timestamp,
};

const prediction = {
  data: readings(2, 3),
  meta: { method: 'movingAverage' as const, window: 5, used: 3, horizon: 2 },
};

function sensorState(store: ReturnType<typeof setupStore>) {
  return selectSensorReadings(store.getState(), SENSOR);
}

/** Mocks for a reload after a write: an empty series and no forecast. */
function mockReload() {
  vi.mocked(readingsApi.listReadings).mockResolvedValue(page([], false));
  vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue({
    ...metrics,
    count: 0,
  });
  vi.mocked(readingsApi.getPrediction).mockResolvedValue(prediction);
}

describe('readingsSlice', () => {
  beforeEach(() => vi.resetAllMocks());

  it('gives unseen sensors an empty state', () => {
    const state = sensorState(setupStore());
    expect(state).toMatchObject({
      status: 'idle',
      series: [],
      metrics: null,
      predictionQuery: DEFAULT_PREDICTION_QUERY,
    });
  });

  describe('loadReadings', () => {
    it('loads the series and its metrics', async () => {
      vi.mocked(readingsApi.listReadings).mockResolvedValue(
        page(readings(3), false),
      );
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const store = setupStore();

      await store.dispatch(loadReadings(SENSOR));

      expect(sensorState(store)).toMatchObject({
        status: 'succeeded',
        series: readings(3),
        truncated: false,
        metrics,
      });
    });

    it('follows the cursor across pages', async () => {
      const first = readings(MAX_READINGS_PAGE_SIZE);
      vi.mocked(readingsApi.listReadings)
        .mockResolvedValueOnce(page(first, true))
        .mockResolvedValueOnce(
          page(readings(10, MAX_READINGS_PAGE_SIZE), false),
        );
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const store = setupStore();

      await store.dispatch(loadReadings(SENSOR));

      expect(readingsApi.listReadings).toHaveBeenNthCalledWith(2, SENSOR, {
        after: first.at(-1)?.timestamp,
        limit: MAX_READINGS_PAGE_SIZE,
      });
      expect(sensorState(store).series).toHaveLength(
        MAX_READINGS_PAGE_SIZE + 10,
      );
      expect(sensorState(store).truncated).toBe(false);
    });

    it(`stops at ${MAX_CHART_POINTS} points and flags the cut`, async () => {
      vi.mocked(readingsApi.listReadings).mockImplementation(
        async (_, query) => {
          const offset = query?.after ? MAX_READINGS_PAGE_SIZE : 0;
          return page(readings(MAX_READINGS_PAGE_SIZE, offset), true);
        },
      );
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const store = setupStore();

      await store.dispatch(loadReadings(SENSOR));

      expect(readingsApi.listReadings).toHaveBeenCalledTimes(2);
      expect(sensorState(store).series).toHaveLength(MAX_CHART_POINTS);
      expect(sensorState(store).truncated).toBe(true);
    });

    it('applies the selected range to the series and the metrics', async () => {
      vi.mocked(readingsApi.listReadings).mockResolvedValue(page([], false));
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const range = {
        from: '2026-10-01T00:00:00.000Z',
        to: '2026-10-02T00:00:00.000Z',
      };
      const store = setupStore();
      store.dispatch(rangeChanged({ sensorId: SENSOR, range }));

      await store.dispatch(loadReadings(SENSOR));

      expect(readingsApi.listReadings).toHaveBeenCalledWith(SENSOR, {
        ...range,
        after: undefined,
        limit: MAX_READINGS_PAGE_SIZE,
      });
      expect(readingsApi.getReadingsMetrics).toHaveBeenCalledWith(
        SENSOR,
        range,
      );
    });

    it('keeps the error', async () => {
      vi.mocked(readingsApi.listReadings).mockRejectedValue(
        httpError(404, {
          error: { code: 'NOT_FOUND', message: 'Sensor not found' },
        }),
      );
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const store = setupStore();
      await store.dispatch(loadReadings(SENSOR));
      expect(sensorState(store)).toMatchObject({
        status: 'failed',
        error: { status: 404, message: 'Sensor not found' },
      });
    });

    it('ignores a response that arrives after a newer request', async () => {
      const older = deferred<ReadingsPageDto>();
      vi.mocked(readingsApi.listReadings)
        .mockReturnValueOnce(older.promise)
        .mockResolvedValueOnce(page(readings(1, 50), false));
      vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
      const store = setupStore();

      const first = store.dispatch(loadReadings(SENSOR));
      await store.dispatch(loadReadings(SENSOR));
      older.resolve(page(readings(1, 0), false));
      await first;

      expect(sensorState(store).series).toEqual(readings(1, 50));
    });
  });

  describe('loadPrediction', () => {
    it('asks for the selected method, window and horizon', async () => {
      vi.mocked(readingsApi.getPrediction).mockResolvedValue(prediction);
      const store = setupStore();
      store.dispatch(
        predictionQueryChanged({
          sensorId: SENSOR,
          query: { method: 'linearRegression', window: 20 },
        }),
      );

      await store.dispatch(loadPrediction(SENSOR));

      expect(readingsApi.getPrediction).toHaveBeenCalledWith(SENSOR, {
        method: 'linearRegression',
        window: 20,
        horizon: DEFAULT_PREDICTION_QUERY.horizon,
      });
      expect(sensorState(store)).toMatchObject({
        predictionStatus: 'succeeded',
        prediction,
      });
    });

    it('drops the old forecast when the series is too short', async () => {
      vi.mocked(readingsApi.getPrediction)
        .mockResolvedValueOnce(prediction)
        .mockRejectedValueOnce(
          httpError(422, {
            error: {
              code: 'BUSINESS_RULE_VIOLATION',
              message: 'A prediction needs at least 2 readings',
            },
          }),
        );
      const store = setupStore();
      await store.dispatch(loadPrediction(SENSOR));

      await store.dispatch(loadPrediction(SENSOR));

      expect(sensorState(store)).toMatchObject({
        predictionStatus: 'failed',
        prediction: null,
        predictionError: { status: 422 },
      });
    });
  });

  describe('uploadReadings', () => {
    it('sends batches of at most 1000 and adds up the results', async () => {
      vi.mocked(readingsApi.createReadings).mockImplementation(
        async (_, batch) => ({
          received: batch.length,
          inserted: batch.length - 1,
          duplicates: 1,
        }),
      );
      mockReload();
      const store = setupStore();

      const result = await store
        .dispatch(
          uploadReadings({ sensorId: SENSOR, readings: readings(2500) }),
        )
        .unwrap();

      const batches = vi
        .mocked(readingsApi.createReadings)
        .mock.calls.map(([, batch]) => batch.length);
      expect(batches).toEqual([1000, 1000, 500]);
      expect(result).toEqual({ received: 2500, inserted: 2497, duplicates: 3 });
      // Then everything the upload changed is reloaded.
      expect(readingsApi.listReadings).toHaveBeenCalled();
      expect(readingsApi.getPrediction).toHaveBeenCalled();
      expect(sensorState(store).upload).toBeNull();
    });

    it('reports progress between batches', async () => {
      const second = deferred<{
        received: number;
        inserted: number;
        duplicates: number;
      }>();
      const ok = { received: 1000, inserted: 1000, duplicates: 0 };
      vi.mocked(readingsApi.createReadings)
        .mockResolvedValueOnce(ok)
        .mockReturnValueOnce(second.promise);
      mockReload();
      const store = setupStore();

      const upload = store.dispatch(
        uploadReadings({ sensorId: SENSOR, readings: readings(2000) }),
      );
      await vi.waitFor(() =>
        expect(sensorState(store).upload).toEqual({ sent: 1000, total: 2000 }),
      );
      second.resolve(ok);
      await upload;
      expect(sensorState(store).upload).toBeNull();
    });

    it('stops at a failing batch and says how much was stored', async () => {
      vi.mocked(readingsApi.createReadings)
        .mockResolvedValueOnce({
          received: 1000,
          inserted: 1000,
          duplicates: 0,
        })
        .mockRejectedValueOnce(
          httpError(400, {
            error: { code: 'VALIDATION_ERROR', message: 'Invalid reading' },
          }),
        );
      mockReload();
      const store = setupStore();

      await expect(
        store
          .dispatch(
            uploadReadings({ sensorId: SENSOR, readings: readings(3000) }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: 400, sent: 1000 });
      expect(readingsApi.createReadings).toHaveBeenCalledTimes(2);
      // What was stored is shown.
      expect(readingsApi.listReadings).toHaveBeenCalled();
      expect(sensorState(store).upload).toBeNull();
    });
  });

  describe('deleteReadings', () => {
    it('deletes the range and reloads', async () => {
      vi.mocked(readingsApi.deleteReadings).mockResolvedValue(42);
      mockReload();
      const store = setupStore();
      const range = { from: '2026-10-01T00:00:00.000Z' };

      const deleted = await store
        .dispatch(deleteReadings({ sensorId: SENSOR, range }))
        .unwrap();

      expect(deleted).toBe(42);
      expect(readingsApi.deleteReadings).toHaveBeenCalledWith(SENSOR, range);
      expect(sensorState(store).metrics?.count).toBe(0);
    });

    it('deletes everything without a range', async () => {
      vi.mocked(readingsApi.deleteReadings).mockResolvedValue(3);
      mockReload();
      const store = setupStore();
      await store.dispatch(deleteReadings({ sensorId: SENSOR }));
      expect(readingsApi.deleteReadings).toHaveBeenCalledWith(SENSOR, {});
    });
  });

  it('forgets every sensor on logout', async () => {
    vi.mocked(readingsApi.listReadings).mockResolvedValue(
      page(readings(3), false),
    );
    vi.mocked(readingsApi.getReadingsMetrics).mockResolvedValue(metrics);
    const store = setupStore();
    await store.dispatch(loadReadings(SENSOR));

    await store.dispatch(logout());

    expect(store.getState().readings.bySensorId).toEqual({});
  });
});

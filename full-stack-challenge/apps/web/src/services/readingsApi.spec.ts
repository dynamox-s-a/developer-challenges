import { apiClient } from './apiClient';
import * as readingsApi from './readingsApi';

const SENSOR = 's-1';
const range = { from: '2026-10-01T00:00:00Z', to: '2026-10-02T00:00:00Z' };

describe('readingsApi', () => {
  afterEach(() => vi.restoreAllMocks());

  function mockGet(data: unknown) {
    return vi.spyOn(apiClient, 'get').mockResolvedValue({ data });
  }

  it('posts a batch of readings', async () => {
    const result = { received: 1, inserted: 1, duplicates: 0 };
    const post = vi
      .spyOn(apiClient, 'post')
      .mockResolvedValue({ data: result });
    const batch = [{ timestamp: range.from, value: 1.5 }];

    expect(await readingsApi.createReadings(SENSOR, batch)).toEqual(result);
    expect(post).toHaveBeenCalledWith('/sensors/s-1/readings', {
      readings: batch,
    });
  });

  it('lists a page with the cursor and range', async () => {
    const get = mockGet({ data: [], meta: { limit: 10, nextCursor: null } });
    await readingsApi.listReadings(SENSOR, { ...range, limit: 10, after: 'c' });
    expect(get).toHaveBeenCalledWith('/sensors/s-1/readings', {
      params: { ...range, limit: 10, after: 'c' },
    });
  });

  it('unwraps the count', async () => {
    const get = mockGet({ count: 288 });
    expect(await readingsApi.countReadings(SENSOR)).toBe(288);
    expect(get).toHaveBeenCalledWith('/sensors/s-1/readings/count', {
      params: {},
    });
  });

  it('gets the metrics for a range', async () => {
    const get = mockGet({ count: 0 });
    await readingsApi.getReadingsMetrics(SENSOR, range);
    expect(get).toHaveBeenCalledWith('/sensors/s-1/readings/metrics', {
      params: range,
    });
  });

  it('deletes a range and returns how many readings went', async () => {
    const del = vi
      .spyOn(apiClient, 'delete')
      .mockResolvedValue({ data: { deleted: 7 } });
    expect(await readingsApi.deleteReadings(SENSOR, range)).toBe(7);
    expect(del).toHaveBeenCalledWith('/sensors/s-1/readings', {
      params: range,
    });
  });

  it('asks for a prediction', async () => {
    const get = mockGet({ data: [], meta: {} });
    const query = {
      method: 'linearRegression' as const,
      window: 10,
      horizon: 5,
    };
    await readingsApi.getPrediction(SENSOR, query);
    expect(get).toHaveBeenCalledWith('/sensors/s-1/readings/prediction', {
      params: query,
    });
  });
});

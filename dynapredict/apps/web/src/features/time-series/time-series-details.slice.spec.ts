import { AxiosError, type AxiosResponse } from 'axios';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import {
  fetchTimeSeriesDetails,
  type TimeSeriesDetails,
  type TimeSeriesMetrics,
} from './time-series-details.slice';

const series: TimeSeriesDetails = {
  id: 'series-1',
  name: 'Temperatura',
  unit: '°C',
  sensorSerialNumber: 'DyL4.01.A0001',
  monitoringPointId: 'point-1',
  sampleCount: 2,
  startedAt: '2026-11-22T10:00:00.000Z',
  endedAt: '2026-11-22T10:10:00.000Z',
  createdAt: '2026-11-22T11:00:00.000Z',
  samples: [
    { timestamp: '2026-11-22T10:00:00.000Z', value: 31.5 },
    { timestamp: '2026-11-22T10:10:00.000Z', value: 32 },
  ],
};

const metrics: TimeSeriesMetrics = {
  count: 2,
  min: 31.5,
  max: 32,
  mean: 31.75,
  stdDev: 0.25,
  rms: 31.751,
};

// A API falsa: as métricas numa URL, e a série na outra
function mockApi() {
  vi.spyOn(api, 'get').mockImplementation(async (url) =>
    url.endsWith('/metrics') ? { data: metrics } : { data: series },
  );
}

describe('time series details slice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should start empty', () => {
    const store = setupStore();

    expect(store.getState().timeSeriesDetails).toEqual({
      series: null,
      metrics: null,
      status: 'idle',
      error: null,
    });
  });

  it('should ask the api for the series and its metrics and store them', async () => {
    mockApi();
    const store = setupStore();

    await store.dispatch(fetchTimeSeriesDetails('series-1'));

    expect(api.get).toHaveBeenCalledWith('/time-series/series-1', {
      signal: expect.any(AbortSignal),
    });
    expect(api.get).toHaveBeenCalledWith('/time-series/series-1/metrics', {
      signal: expect.any(AbortSignal),
    });
    expect(store.getState().timeSeriesDetails).toEqual({
      series,
      metrics,
      status: 'succeeded',
      error: null,
    });
  });

  it('should keep the api error message when the request fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: { code: 'NOT_FOUND', message: 'Série temporal não encontrada' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'get').mockRejectedValue(error);
    const store = setupStore();

    await store.dispatch(fetchTimeSeriesDetails('nao-existe'));

    expect(store.getState().timeSeriesDetails).toMatchObject({
      status: 'failed',
      error: 'Série temporal não encontrada',
    });
  });

  it('should not show an error for a request that was canceled', async () => {
    // Uma API que nunca responde: a busca só termina porque foi cancelada
    vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    const store = setupStore();

    const request = store.dispatch(fetchTimeSeriesDetails('series-1'));
    request.abort();
    await request;

    expect(store.getState().timeSeriesDetails.status).not.toBe('failed');
    expect(store.getState().timeSeriesDetails.error).toBeNull();
  });

  it('should forget the series on logout', async () => {
    mockApi();
    const store = setupStore();
    await store.dispatch(fetchTimeSeriesDetails('series-1'));

    await store.dispatch(logout());

    expect(store.getState().timeSeriesDetails.series).toBeNull();
    expect(store.getState().timeSeriesDetails.metrics).toBeNull();
  });
});

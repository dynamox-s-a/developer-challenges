import { AxiosError, type AxiosResponse } from 'axios';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import type { MonitoringPoint } from '../monitoring-points/monitoring-points.slice';
import {
  fetchPointTimeSeries,
  uploadTimeSeries,
  type TimeSeriesSummary,
} from './time-series.slice';

const point: MonitoringPoint = {
  id: 'point-1',
  name: 'Mancal LA',
  machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
  sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
};

const series: TimeSeriesSummary[] = [
  {
    id: 'series-1',
    name: 'Velocidade RMS',
    unit: 'mm/s',
    sensorSerialNumber: 'DyL4.01.A0001',
    monitoringPointId: 'point-1',
    sampleCount: 10000,
    startedAt: '2026-11-22T10:00:00.000Z',
    endedAt: '2026-11-22T12:46:39.000Z',
    createdAt: '2026-11-22T13:00:00.000Z',
  },
];

// A API falsa: a lista de séries numa URL, e o ponto na outra
function mockApi() {
  vi.spyOn(api, 'get').mockImplementation(async (url) =>
    url.endsWith('/time-series') ? { data: series } : { data: point },
  );
}

describe('time series slice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should start empty', () => {
    const store = setupStore();

    expect(store.getState().timeSeries).toEqual({
      point: null,
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('should ask the api for the point and its series and store them', async () => {
    mockApi();
    const store = setupStore();

    await store.dispatch(fetchPointTimeSeries('point-1'));

    expect(api.get).toHaveBeenCalledWith('/monitoring-points/point-1', {
      signal: expect.any(AbortSignal),
    });
    expect(api.get).toHaveBeenCalledWith(
      '/monitoring-points/point-1/time-series',
      { signal: expect.any(AbortSignal) },
    );
    expect(store.getState().timeSeries).toEqual({
      point,
      items: series,
      status: 'succeeded',
      error: null,
    });
  });

  it('should keep the api error message when the request fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: {
          code: 'NOT_FOUND',
          message: 'Ponto de monitoramento não encontrado',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'get').mockRejectedValue(error);
    const store = setupStore();

    await store.dispatch(fetchPointTimeSeries('nao-existe'));

    expect(store.getState().timeSeries).toMatchObject({
      status: 'failed',
      error: 'Ponto de monitoramento não encontrado',
    });
  });

  it('should not show an error for a request that was canceled', async () => {
    // Uma API que nunca responde: a busca só termina porque foi cancelada
    vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    const store = setupStore();

    const request = store.dispatch(fetchPointTimeSeries('point-1'));
    request.abort();
    await request;

    expect(store.getState().timeSeries.status).not.toBe('failed');
    expect(store.getState().timeSeries.error).toBeNull();
  });

  it('should forget the point and the series on logout', async () => {
    mockApi();
    const store = setupStore();
    await store.dispatch(fetchPointTimeSeries('point-1'));

    await store.dispatch(logout());

    expect(store.getState().timeSeries.point).toBeNull();
    expect(store.getState().timeSeries.items).toEqual([]);
  });

  it('should send a series to the point given in the url', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: series[0] });
    const store = setupStore();
    const samples = [{ timestamp: '2026-11-22T10:00:00Z', value: 31.5 }];

    const result = await store
      .dispatch(
        uploadTimeSeries({
          pointId: 'point-1',
          name: 'Temperatura',
          unit: '°C',
          samples,
        }),
      )
      .unwrap();

    // O ponto vai na URL; o resto, no corpo
    expect(api.post).toHaveBeenCalledWith(
      '/monitoring-points/point-1/time-series',
      { name: 'Temperatura', unit: '°C', samples },
    );
    expect(result).toEqual(series[0]);
  });
});

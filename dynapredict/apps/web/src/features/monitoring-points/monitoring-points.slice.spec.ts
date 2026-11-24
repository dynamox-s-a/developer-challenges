import { AxiosError, type AxiosResponse } from 'axios';
import type { MonitoringPointListQuery } from '@dynapredict/shared';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
  fetchMonitoringPoints,
  removeSensor,
  setSensor,
  type MonitoringPointsPage,
} from './monitoring-points.slice';

const query: MonitoringPointListQuery = {
  page: 2,
  pageSize: 5,
  sortBy: 'machineType',
  order: 'desc',
};

const page: MonitoringPointsPage = {
  items: [
    {
      id: 'point-1',
      name: 'Mancal LA',
      machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
      sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
    },
  ],
  total: 6,
  page: 2,
  pageSize: 5,
};

describe('monitoring points slice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should start empty', () => {
    const store = setupStore();

    expect(store.getState().monitoringPoints).toEqual({
      items: [],
      total: 0,
      status: 'idle',
      error: null,
    });
  });

  it('should ask the api for the page and store it', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: page });
    const store = setupStore();

    await store.dispatch(fetchMonitoringPoints(query));

    // A página e a ordem vão na URL: ?page=2&pageSize=5&sortBy=...
    expect(api.get).toHaveBeenCalledWith('/monitoring-points', {
      params: query,
      signal: expect.any(AbortSignal),
    });
    expect(store.getState().monitoringPoints).toEqual({
      items: page.items,
      total: 6,
      status: 'succeeded',
      error: null,
    });
  });

  it('should keep the api error message when the request fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 400,
      data: {
        error: { code: 'VALIDATION_ERROR', message: 'Parâmetros inválidos' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'get').mockRejectedValue(error);
    const store = setupStore();

    await store.dispatch(fetchMonitoringPoints(query));

    expect(store.getState().monitoringPoints).toMatchObject({
      status: 'failed',
      error: 'Parâmetros inválidos',
    });
  });

  it('should not show an error for a request that was canceled', async () => {
    // Uma API que nunca responde: a busca só termina porque foi cancelada
    vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    const store = setupStore();

    const request = store.dispatch(fetchMonitoringPoints(query));
    request.abort();
    await request;

    expect(store.getState().monitoringPoints.status).not.toBe('failed');
    expect(store.getState().monitoringPoints.error).toBeNull();
  });

  it('should forget the points on logout', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: page });
    const store = setupStore();
    await store.dispatch(fetchMonitoringPoints(query));

    await store.dispatch(logout());

    expect(store.getState().monitoringPoints.items).toEqual([]);
    expect(store.getState().monitoringPoints.total).toBe(0);
  });

  it('should create the point in the machine given in the url', async () => {
    const created = { id: 'point-9', name: 'Base', machineId: 'machine-7' };
    vi.spyOn(api, 'post').mockResolvedValue({ data: created });
    const store = setupStore();

    const result = await store
      .dispatch(createMonitoringPoint({ machineId: 'machine-7', name: 'Base' }))
      .unwrap();

    expect(api.post).toHaveBeenCalledWith(
      '/machines/machine-7/monitoring-points',
      { name: 'Base' },
    );
    expect(result).toEqual(created);
  });

  it('should put the sensor on the point given in the url', async () => {
    const sensor = {
      id: 'sensor-9',
      model: 'HF+',
      serialNumber: 'DyL4.01.A0009',
    };
    vi.spyOn(api, 'put').mockResolvedValue({ data: sensor });
    const store = setupStore();

    const result = await store
      .dispatch(
        setSensor({
          pointId: 'point-7',
          model: 'HF+',
          serialNumber: 'DyL4.01.A0009',
        }),
      )
      .unwrap();

    // O id do ponto vai na URL; o modelo e o número, no corpo
    expect(api.put).toHaveBeenCalledWith('/monitoring-points/point-7/sensor', {
      model: 'HF+',
      serialNumber: 'DyL4.01.A0009',
    });
    expect(result).toEqual(sensor);
  });

  it('should remove the sensor of the point given in the url', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const store = setupStore();

    const result = await store.dispatch(removeSensor('point-7')).unwrap();

    expect(api.delete).toHaveBeenCalledWith(
      '/monitoring-points/point-7/sensor',
    );
    expect(result).toBe('point-7');
  });

  it('should delete the point given in the url', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const store = setupStore();

    const result = await store
      .dispatch(deleteMonitoringPoint('point-7'))
      .unwrap();

    expect(api.delete).toHaveBeenCalledWith('/monitoring-points/point-7');
    expect(result).toBe('point-7');
  });
});

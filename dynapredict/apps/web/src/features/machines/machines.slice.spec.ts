import { AxiosError, type AxiosResponse } from 'axios';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import { fetchMachines, type Machine } from './machines.slice';

const machine: Machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump',
  createdAt: '2026-11-21T10:00:00.000Z',
  updatedAt: '2026-11-21T10:00:00.000Z',
};

describe('machines slice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should start empty', () => {
    const store = setupStore();

    expect(store.getState().machines).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('should store the machines returned by the api', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine] });
    const store = setupStore();

    await store.dispatch(fetchMachines());

    expect(api.get).toHaveBeenCalledWith('/machines');
    expect(store.getState().machines).toMatchObject({
      items: [machine],
      status: 'succeeded',
    });
  });

  it('should keep the api error message when the request fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
    error.response = {
      status: 500,
      data: {
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'get').mockRejectedValue(error);
    const store = setupStore();

    await store.dispatch(fetchMachines());

    expect(store.getState().machines).toMatchObject({
      status: 'failed',
      error: 'Erro interno do servidor',
    });
  });

  it('should forget the machines on logout', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine] });
    const store = setupStore();
    await store.dispatch(fetchMachines());

    await store.dispatch(logout());

    expect(store.getState().machines.items).toEqual([]);
  });
});

import { AxiosError, type AxiosResponse } from 'axios';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import {
  createMachine,
  deleteMachine,
  fetchMachines,
  updateMachine,
  type Machine,
} from './machines.slice';

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

  it('should put a new machine at the top of the list', async () => {
    const newMachine: Machine = {
      ...machine,
      id: 'machine-2',
      name: 'Ventilador 01',
      type: 'Fan',
    };
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine] });
    vi.spyOn(api, 'post').mockResolvedValue({ data: newMachine });
    const store = setupStore();
    await store.dispatch(fetchMachines());

    await store.dispatch(createMachine({ name: 'Ventilador 01', type: 'Fan' }));

    expect(api.post).toHaveBeenCalledWith('/machines', {
      name: 'Ventilador 01',
      type: 'Fan',
    });
    expect(store.getState().machines.items).toEqual([newMachine, machine]);
  });

  it('should replace the edited machine in the list', async () => {
    const edited: Machine = { ...machine, name: 'Bomba 01 revisada' };
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine] });
    vi.spyOn(api, 'put').mockResolvedValue({ data: edited });
    const store = setupStore();
    await store.dispatch(fetchMachines());

    await store.dispatch(
      updateMachine({
        id: 'machine-1',
        name: 'Bomba 01 revisada',
        type: 'Pump',
      }),
    );

    expect(api.put).toHaveBeenCalledWith('/machines/machine-1', {
      name: 'Bomba 01 revisada',
      type: 'Pump',
    });
    expect(store.getState().machines.items).toEqual([edited]);
  });

  it('should take the deleted machine out of the list', async () => {
    const other: Machine = { ...machine, id: 'machine-2', name: 'Bomba 02' };
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine, other] });
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const store = setupStore();
    await store.dispatch(fetchMachines());

    await store.dispatch(deleteMachine('machine-1'));

    expect(api.delete).toHaveBeenCalledWith('/machines/machine-1');
    expect(store.getState().machines.items).toEqual([other]);
  });

  it('should forget the machines on logout', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [machine] });
    const store = setupStore();
    await store.dispatch(fetchMachines());

    await store.dispatch(logout());

    expect(store.getState().machines.items).toEqual([]);
  });
});

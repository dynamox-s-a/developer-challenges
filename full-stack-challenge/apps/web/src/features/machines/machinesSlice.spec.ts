import type { MachineDto, Paginated } from '@dynapredict/shared-types';
import { setupStore } from '../../app/store';
import * as machinesApi from '../../services/machinesApi';
import {
  aMachine as machine,
  aPage as page,
  deferred,
} from '../../testing/fixtures';
import { httpError } from '../../testing/renderWithProviders';
import { logout } from '../auth/authSlice';
import {
  createMachine,
  DEFAULT_MACHINES_QUERY,
  deleteMachine,
  fetchMachines,
  machinesReducer,
  pageChanged,
  pageSizeChanged,
  sortChanged,
  updateMachine,
} from './machinesSlice';

vi.mock('../../services/machinesApi');
vi.mock('../../services/authApi');

describe('machinesSlice', () => {
  beforeEach(() => vi.resetAllMocks());

  describe('query reducers', () => {
    const state = machinesReducer(undefined, { type: 'init' });

    it('starts on the API defaults: newest first, 10 per page', () => {
      expect(state.query).toEqual(DEFAULT_MACHINES_QUERY);
      expect(state.status).toBe('idle');
    });

    it('changes the page', () => {
      expect(machinesReducer(state, pageChanged(3)).query.page).toBe(3);
    });

    it('goes back to page 1 on a new page size or sort', () => {
      const onPage3 = machinesReducer(state, pageChanged(3));
      expect(machinesReducer(onPage3, pageSizeChanged(25)).query).toEqual({
        ...DEFAULT_MACHINES_QUERY,
        pageSize: 25,
      });
      expect(
        machinesReducer(
          onPage3,
          sortChanged({ sortBy: 'name', sortDir: 'asc' }),
        ).query,
      ).toEqual({ ...DEFAULT_MACHINES_QUERY, sortBy: 'name', sortDir: 'asc' });
    });
  });

  describe('fetchMachines', () => {
    it('requests the current query and stores the page', async () => {
      const response = page([machine()], { total: 1 });
      vi.mocked(machinesApi.listMachines).mockResolvedValue(response);
      const store = setupStore();
      store.dispatch(sortChanged({ sortBy: 'name', sortDir: 'asc' }));

      await store.dispatch(fetchMachines());

      expect(machinesApi.listMachines).toHaveBeenCalledWith({
        ...DEFAULT_MACHINES_QUERY,
        sortBy: 'name',
        sortDir: 'asc',
      });
      expect(store.getState().machines).toMatchObject({
        status: 'succeeded',
        items: response.data,
        meta: response.meta,
        error: null,
      });
    });

    it('keeps the API error', async () => {
      vi.mocked(machinesApi.listMachines).mockRejectedValue(
        httpError(500, { error: { code: 'INTERNAL', message: 'Boom' } }),
      );
      const store = setupStore();
      await store.dispatch(fetchMachines());
      expect(store.getState().machines).toMatchObject({
        status: 'failed',
        error: { status: 500, message: 'Boom' },
      });
    });

    it('ignores a response that arrives after a newer request', async () => {
      const older = deferred<Paginated<MachineDto>>();
      const newer = deferred<Paginated<MachineDto>>();
      vi.mocked(machinesApi.listMachines)
        .mockReturnValueOnce(older.promise)
        .mockReturnValueOnce(newer.promise);
      const store = setupStore();

      const first = store.dispatch(fetchMachines());
      const second = store.dispatch(fetchMachines());
      newer.resolve(page([machine({ id: 'new', name: 'Newer' })]));
      await second;
      older.resolve(page([machine({ id: 'old', name: 'Older' })]));
      await first;

      expect(store.getState().machines.items.map((m) => m.id)).toEqual(['new']);
      expect(store.getState().machines.status).toBe('succeeded');
    });
  });

  describe('mutations', () => {
    it('creates a machine and reloads the page', async () => {
      const created = machine({ id: 'm-2', name: 'Fan 02', type: 'Fan' });
      vi.mocked(machinesApi.createMachine).mockResolvedValue(created);
      vi.mocked(machinesApi.listMachines).mockResolvedValue(page([created]));
      const store = setupStore();

      const result = await store
        .dispatch(createMachine({ name: 'Fan 02', type: 'Fan' }))
        .unwrap();

      expect(result).toEqual(created);
      expect(machinesApi.createMachine).toHaveBeenCalledWith({
        name: 'Fan 02',
        type: 'Fan',
      });
      await vi.waitFor(() =>
        expect(store.getState().machines.items).toEqual([created]),
      );
    });

    it('rejects an update with the API error, without reloading', async () => {
      vi.mocked(machinesApi.updateMachine).mockRejectedValue(
        httpError(422, {
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'A Pump machine cannot have TcAg or TcAs sensors',
          },
        }),
      );
      const store = setupStore();

      await expect(
        store
          .dispatch(
            updateMachine({ id: 'm-1', input: { name: 'X', type: 'Pump' } }),
          )
          .unwrap(),
      ).rejects.toMatchObject({
        status: 422,
        message: 'A Pump machine cannot have TcAg or TcAs sensors',
      });
      expect(machinesApi.listMachines).not.toHaveBeenCalled();
    });

    it('steps back a page when deleting the last row of a page', async () => {
      vi.mocked(machinesApi.listMachines)
        .mockResolvedValueOnce(page([machine()], { page: 2, total: 11 }))
        .mockResolvedValue(page([], { total: 10 }));
      vi.mocked(machinesApi.deleteMachine).mockResolvedValue();
      const store = setupStore();
      store.dispatch(pageChanged(2));
      await store.dispatch(fetchMachines());

      await store.dispatch(deleteMachine('m-1')).unwrap();

      expect(machinesApi.deleteMachine).toHaveBeenCalledWith('m-1');
      expect(store.getState().machines.query.page).toBe(1);
      expect(machinesApi.listMachines).toHaveBeenLastCalledWith(
        DEFAULT_MACHINES_QUERY,
      );
    });

    it('stays on the page when other rows remain', async () => {
      vi.mocked(machinesApi.listMachines).mockResolvedValue(
        page([machine(), machine({ id: 'm-2' })], { page: 2, total: 12 }),
      );
      vi.mocked(machinesApi.deleteMachine).mockResolvedValue();
      const store = setupStore();
      store.dispatch(pageChanged(2));
      await store.dispatch(fetchMachines());

      await store.dispatch(deleteMachine('m-1')).unwrap();
      expect(store.getState().machines.query.page).toBe(2);
    });
  });

  it('forgets everything on logout', async () => {
    vi.mocked(machinesApi.listMachines).mockResolvedValue(page([machine()]));
    const store = setupStore();
    store.dispatch(pageChanged(4));
    await store.dispatch(fetchMachines());

    await store.dispatch(logout());

    expect(store.getState().machines).toEqual(
      machinesReducer(undefined, { type: 'init' }),
    );
  });
});

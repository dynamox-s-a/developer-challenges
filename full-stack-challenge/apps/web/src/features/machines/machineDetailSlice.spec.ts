import { type AppDispatch, setupStore } from '../../app/store';
import * as machinesApi from '../../services/machinesApi';
import * as monitoringPointsApi from '../../services/monitoringPointsApi';
import * as sensorsApi from '../../services/sensorsApi';
import { aMachineDetail, aSensor } from '../../testing/fixtures';
import { httpError } from '../../testing/renderWithProviders';
import { logout } from '../auth/authSlice';
import {
  attachSensor,
  createPoint,
  deletePoint,
  fetchMachineDetail,
  removeSensor,
  renamePoint,
} from './machineDetailSlice';

vi.mock('../../services/machinesApi');
vi.mock('../../services/monitoringPointsApi');
vi.mock('../../services/sensorsApi');
vi.mock('../../services/authApi');

const point = {
  id: 'p-1',
  name: 'Bearing DE',
  sensor: null,
  createdAt: '2026-10-01T12:00:00.000Z',
  updatedAt: '2026-10-01T12:00:00.000Z',
};

async function storeWithMachine(machine = aMachineDetail()) {
  vi.mocked(machinesApi.getMachine).mockResolvedValue(machine);
  const store = setupStore();
  await store.dispatch(fetchMachineDetail(machine.id));
  vi.mocked(machinesApi.getMachine).mockClear();
  return store;
}

describe('machineDetailSlice', () => {
  beforeEach(() => vi.resetAllMocks());

  describe('fetchMachineDetail', () => {
    it('stores the machine with its points', async () => {
      const machine = aMachineDetail({ monitoringPoints: [point] });
      const store = await storeWithMachine(machine);
      expect(store.getState().machineDetail).toMatchObject({
        status: 'succeeded',
        machine,
        error: null,
      });
    });

    it('hides the previous machine while another one loads', async () => {
      const store = await storeWithMachine(aMachineDetail({ id: 'm-1' }));
      vi.mocked(machinesApi.getMachine).mockReturnValue(
        new Promise(() => undefined),
      );
      void store.dispatch(fetchMachineDetail('m-2'));
      expect(store.getState().machineDetail.machine).toBeNull();
    });

    it('keeps the machine on screen while reloading it', async () => {
      const store = await storeWithMachine(aMachineDetail({ id: 'm-1' }));
      vi.mocked(machinesApi.getMachine).mockReturnValue(
        new Promise(() => undefined),
      );
      void store.dispatch(fetchMachineDetail('m-1'));
      expect(store.getState().machineDetail.machine?.id).toBe('m-1');
    });

    it('keeps a 404 so the page can say the machine is gone', async () => {
      vi.mocked(machinesApi.getMachine).mockRejectedValue(
        httpError(404, {
          error: { code: 'NOT_FOUND', message: 'Machine not found' },
        }),
      );
      const store = setupStore();
      await store.dispatch(fetchMachineDetail('missing'));
      expect(store.getState().machineDetail).toMatchObject({
        status: 'failed',
        error: { status: 404 },
      });
    });
  });

  describe('mutations reload the machine afterwards', () => {
    it.each([
      [
        'createPoint',
        (dispatch: AppDispatch) =>
          dispatch(
            createPoint({ machineId: 'm-1', name: 'Bearing DE' }),
          ).unwrap(),
        () =>
          expect(
            monitoringPointsApi.createMonitoringPoint,
          ).toHaveBeenCalledWith('m-1', { name: 'Bearing DE' }),
      ],
      [
        'renamePoint',
        (dispatch: AppDispatch) =>
          dispatch(
            renamePoint({ pointId: 'p-1', name: 'Bearing NDE' }),
          ).unwrap(),
        () =>
          expect(
            monitoringPointsApi.renameMonitoringPoint,
          ).toHaveBeenCalledWith('p-1', { name: 'Bearing NDE' }),
      ],
      [
        'deletePoint',
        (dispatch: AppDispatch) => dispatch(deletePoint('p-1')).unwrap(),
        () =>
          expect(
            monitoringPointsApi.deleteMonitoringPoint,
          ).toHaveBeenCalledWith('p-1'),
      ],
      [
        'attachSensor',
        (dispatch: AppDispatch) =>
          dispatch(
            attachSensor({
              pointId: 'p-1',
              input: { serialNumber: 'HFP-9', model: 'HF+' },
            }),
          ).unwrap(),
        () =>
          expect(sensorsApi.attachSensor).toHaveBeenCalledWith('p-1', {
            serialNumber: 'HFP-9',
            model: 'HF+',
          }),
      ],
      [
        'removeSensor',
        (dispatch: AppDispatch) => dispatch(removeSensor('s-1')).unwrap(),
        () => expect(sensorsApi.removeSensor).toHaveBeenCalledWith('s-1'),
      ],
    ])('%s', async (_, action, assertCalled) => {
      const store = await storeWithMachine();
      const updated = aMachineDetail({
        monitoringPoints: [{ ...point, sensor: aSensor() }],
      });
      vi.mocked(machinesApi.getMachine).mockResolvedValue(updated);

      await action(store.dispatch);

      assertCalled();
      expect(machinesApi.getMachine).toHaveBeenCalledWith('m-1');
      expect(store.getState().machineDetail.machine).toEqual(updated);
    });

    it('rejects with the API error and does not reload', async () => {
      const store = await storeWithMachine();
      vi.mocked(sensorsApi.attachSensor).mockRejectedValue(
        httpError(409, {
          error: { code: 'CONFLICT', message: 'Serial number already in use' },
        }),
      );

      await expect(
        store
          .dispatch(
            attachSensor({
              pointId: 'p-1',
              input: { serialNumber: 'HFP-0001', model: 'HF+' },
            }),
          )
          .unwrap(),
      ).rejects.toMatchObject({
        status: 409,
        message: 'Serial number already in use',
      });
      expect(machinesApi.getMachine).not.toHaveBeenCalled();
    });
  });

  it('forgets the machine on logout', async () => {
    const store = await storeWithMachine();
    await store.dispatch(logout());
    expect(store.getState().machineDetail.machine).toBeNull();
  });
});

import reducer, {
  addMonitoringPoint,
  deleteMonitoringPointsByMachine,
  clearMonitoringError,
} from './monitoring.slices';
import { MonitoringPoint } from './monitoring.types';

describe('monitoring slice', () => {
  const initialState = {
    items: [] as MonitoringPoint[],
    error: undefined,
  };

  const baseMonitoringPoint: MonitoringPoint = {
    id: 'mp-1',
    machineId: 'machine-1',
    name: 'Bearing',
    sensor: {
      id: 'sensor-1',
      model: 'HF+',
    },
  };

  it('adds a monitoring point', () => {
    const state = reducer(
      initialState,
      addMonitoringPoint(baseMonitoringPoint)
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(baseMonitoringPoint);
    expect(state.error).toBeUndefined();
  });

  it('adds multiple monitoring points for the same machine', () => {
    const secondPoint: MonitoringPoint = {
      ...baseMonitoringPoint,
      id: 'mp-2',
      name: 'Motor',
    };

    const state = reducer(
      reducer(initialState, addMonitoringPoint(baseMonitoringPoint)),
      addMonitoringPoint(secondPoint)
    );

    expect(state.items).toHaveLength(2);
  });

  it('removes all monitoring points associated with a machine', () => {
    const secondMachinePoint: MonitoringPoint = {
      ...baseMonitoringPoint,
      id: 'mp-2',
      machineId: 'machine-2',
      name: 'Vibration',
    };

    const stateWithPoints = reducer(
      reducer(initialState, addMonitoringPoint(baseMonitoringPoint)),
      addMonitoringPoint(secondMachinePoint)
    );

    expect(stateWithPoints.items).toHaveLength(2);

    const finalState = reducer(
      stateWithPoints,
      deleteMonitoringPointsByMachine('machine-1')
    );

    expect(finalState.items).toHaveLength(1);
    expect(finalState.items[0].machineId).toBe('machine-2');
  });

  it('clears the error message manually', () => {
    const stateWithError = {
      ...initialState,
      error: 'some error',
    };

    const clearedState = reducer(stateWithError, clearMonitoringError());

    expect(clearedState.error).toBeUndefined();
  });
});

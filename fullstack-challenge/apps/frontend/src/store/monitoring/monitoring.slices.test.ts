import reducer, {
  addMonitoringPoint,
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
    machineName: 'Main Pump',
    machineType: 'Pump',
    name: 'Bearing',
    sensor: {
      id: 'sensor-1',
      model: 'HF+',
    },
  };

  it('adds a monitoring point when business rules are satisfied', () => {
    const state = reducer(
      initialState,
      addMonitoringPoint(baseMonitoringPoint)
    );

    expect(state.items).toHaveLength(1);
    expect(state.error).toBeUndefined();
  });

  it('prevents adding more than two monitoring points to the same machine', () => {
    const secondPoint = {
      ...baseMonitoringPoint,
      id: 'mp-2',
      name: 'Motor',
    };

    const thirdPoint = {
      ...baseMonitoringPoint,
      id: 'mp-3',
      name: 'Coupling',
    };

    const stateWithTwoPoints = reducer(
      reducer(initialState, addMonitoringPoint(baseMonitoringPoint)),
      addMonitoringPoint(secondPoint)
    );

    const finalState = reducer(
      stateWithTwoPoints,
      addMonitoringPoint(thirdPoint)
    );

    expect(finalState.items).toHaveLength(2);
    expect(finalState.error).toBe(
      'Cada máquina pode ter no máximo 2 pontos de monitoramento'
    );
  });

  it('blocks TcAg and TcAs sensors for Pump machines', () => {
    const invalidMonitoringPoint: MonitoringPoint = {
      ...baseMonitoringPoint,
      sensor: {
        id: 'sensor-2',
        model: 'TcAg',
      },
    };

    const state = reducer(
      initialState,
      addMonitoringPoint(invalidMonitoringPoint)
    );

    expect(state.items).toHaveLength(0);
    expect(state.error).toBe(
      'Sensores TcAg e TcAs não são permitidos para máquinas do tipo Pump'
    );
  });

  it('clears the error message', () => {
    const stateWithError = reducer(
      initialState,
      addMonitoringPoint({
        ...baseMonitoringPoint,
        sensor: {
          id: 'sensor-3',
          model: 'TcAs',
        },
      })
    );

    expect(stateWithError.error).toBeDefined();

    const clearedState = reducer(stateWithError, clearMonitoringError());

    expect(clearedState.error).toBeUndefined();
  });
});

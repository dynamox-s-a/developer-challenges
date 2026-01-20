import { makeSelectMonitoringPoints } from './monitoring.selectors';
import { MonitoringPoint } from './monitoring.types';

describe('monitoring selectors', () => {
  const items: MonitoringPoint[] = [
    {
      id: '1',
      machineId: 'm1',
      machineName: 'Fan A',
      machineType: 'Fan',
      name: 'Motor',
      sensor: { id: 's1', model: 'HF+' },
    },
    {
      id: '2',
      machineId: 'm2',
      machineName: 'Pump B',
      machineType: 'Pump',
      name: 'Bearing',
      sensor: { id: 's2', model: 'HF+' },
    },
    {
      id: '3',
      machineId: 'm3',
      machineName: 'Fan C',
      machineType: 'Fan',
      name: 'Coupling',
      sensor: { id: 's3', model: 'HF+' },
    },
    {
      id: '4',
      machineId: 'm4',
      machineName: 'Pump D',
      machineType: 'Pump',
      name: 'Shaft',
      sensor: { id: 's4', model: 'HF+' },
    },
    {
      id: '5',
      machineId: 'm5',
      machineName: 'Fan E',
      machineType: 'Fan',
      name: 'Rotor',
      sensor: { id: 's5', model: 'HF+' },
    },
    {
      id: '6',
      machineId: 'm6',
      machineName: 'Pump F',
      machineType: 'Pump',
      name: 'Seal',
      sensor: { id: 's6', model: 'HF+' },
    },
  ];

  const state = {
    monitoring: {
      items,
    },
  } as any;

  it('sorts monitoring points by machine name in ascending order', () => {
    const selector = makeSelectMonitoringPoints();

    const result = selector(state, 'machineName', 'asc', 0, 5);

    const machineNames = result.map((mp) => mp.machineName);

    expect(machineNames).toEqual([
      'Fan A',
      'Fan C',
      'Fan E',
      'Pump B',
      'Pump D',
    ]);
  });

  it('sorts monitoring points by name in descending order', () => {
    const selector = makeSelectMonitoringPoints();

    const result = selector(state, 'name', 'desc', 0, 5);

    const names = result.map((mp) => mp.name);

    expect(names).toEqual(['Shaft', 'Seal', 'Rotor', 'Motor', 'Coupling']);
  });

  it('returns the correct items for the second page', () => {
    const selector = makeSelectMonitoringPoints();

    const result = selector(state, 'machineName', 'asc', 1, 5);

    expect(result).toHaveLength(1);
    expect(result[0].machineName).toBe('Pump F');
  });

  it('returns an empty list when the page exceeds available items', () => {
    const selector = makeSelectMonitoringPoints();

    const result = selector(state, 'machineName', 'asc', 2, 5);

    expect(result).toEqual([]);
  });
});

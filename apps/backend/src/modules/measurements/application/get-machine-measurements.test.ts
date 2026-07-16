import type { Machine } from '@repo/contracts';
import { describe, expect, it } from 'bun:test';

import type { MachineRepository } from '../../machines/domain/machine-repository';
import type { MeasurementRepository } from '../domain/measurement-repository';
import type { SensorSeries } from '../domain/series';
import { makeGetMachineMeasurements } from './get-machine-measurements';

const machine = { id: 'MCH-001' } as Machine;

const series: SensorSeries[] = [
  {
    id: 'velocityRms/x',
    metric: 'velocity',
    axis: 'x',
    unit: 'mm/s',
    points: [
      { datetime: '2023-11-07T00:00:00.000Z', max: 1 },
      { datetime: '2023-11-08T00:00:00.000Z', max: 5 },
    ],
  },
  { id: 'temperature', metric: 'temperature', axis: null, unit: '°C', points: [] },
];

const makeSut = (machines: Machine[] = [machine]) => {
  const machineRepository: MachineRepository = {
    async findAll() {
      return machines;
    },
    async findById(id) {
      return machines.find((item) => item.id === id) ?? null;
    },
  };

  const measurementRepository: MeasurementRepository = {
    async findByMachineId() {
      return series;
    },
  };

  return makeGetMachineMeasurements(measurementRepository, machineRepository);
};

describe('makeGetMachineMeasurements', () => {
  it('retorna null quando a máquina não existe', async () => {
    await expect(makeSut([])({ machineId: 'inexistente' })).resolves.toBeNull();
  });

  it('devolve todas as séries com estatísticas quando não há filtro', async () => {
    const result = await makeSut()({ machineId: 'MCH-001' });

    expect(result?.series).toHaveLength(2);
    expect(result?.series[0].stats).toEqual({ min: 1, max: 5, avg: 3, last: 5 });
  });

  it('filtra por grandeza', async () => {
    const result = await makeSut()({ machineId: 'MCH-001', metrics: ['temperature'] });

    expect(result?.series.map((item) => item.id)).toEqual(['temperature']);
  });

  it('recalcula as estatísticas sobre a janela recortada, não sobre a série inteira', async () => {
    const result = await makeSut()({
      machineId: 'MCH-001',
      metrics: ['velocity'],
      to: '2023-11-07T12:00:00.000Z',
    });

    expect(result?.series[0].points).toHaveLength(1);
    expect(result?.series[0].stats).toEqual({ min: 1, max: 1, avg: 1, last: 1 });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MachineType, SensorModel as PrismaSensorModel } from '@prisma/client';
import { updateMachine } from './machines.service';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    machine: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    monitoringPoint: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../lib/prisma', () => ({
  prisma: prismaMock,
}));

const now = new Date('2026-01-15T12:00:00.000Z');

const fanMachine = {
  id: 'machine-1',
  name: 'Fan A',
  type: MachineType.Fan,
  createdAt: now,
  updatedAt: now,
  _count: { monitoringPoints: 2 },
};

describe('updateMachine type guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.machine.findUnique.mockResolvedValue(fanMachine);
  });

  it('blocks Fan → Pump when a monitoring point has TcAg', async () => {
    prismaMock.monitoringPoint.findMany.mockResolvedValue([
      {
        id: 'point-1',
        name: 'MP-1',
        machineId: 'machine-1',
        createdAt: now,
        updatedAt: now,
        sensor: {
          id: 'SNS-1',
          model: PrismaSensorModel.TcAg,
          monitoringPointId: 'point-1',
          createdAt: now,
          updatedAt: now,
        },
      },
    ]);

    await expect(
      updateMachine('machine-1', { type: MachineType.Pump })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(prismaMock.machine.update).not.toHaveBeenCalled();
  });

  it('allows Fan → Pump when sensors are only HF+ or absent', async () => {
    prismaMock.monitoringPoint.findMany.mockResolvedValue([
      {
        id: 'point-1',
        name: 'MP-1',
        machineId: 'machine-1',
        createdAt: now,
        updatedAt: now,
        sensor: {
          id: 'SNS-1',
          model: PrismaSensorModel.HFPlus,
          monitoringPointId: 'point-1',
          createdAt: now,
          updatedAt: now,
        },
      },
      {
        id: 'point-2',
        name: 'MP-2',
        machineId: 'machine-1',
        createdAt: now,
        updatedAt: now,
        sensor: null,
      },
    ]);
    prismaMock.machine.update.mockResolvedValue({
      ...fanMachine,
      type: MachineType.Pump,
      name: 'Fan A',
    });

    const result = await updateMachine('machine-1', { type: MachineType.Pump });

    expect(prismaMock.machine.update).toHaveBeenCalled();
    expect(result.type).toBe(MachineType.Pump);
  });

  it('does not inspect sensors when type is not changing to Pump', async () => {
    prismaMock.machine.update.mockResolvedValue({
      ...fanMachine,
      name: 'Fan B',
    });

    await updateMachine('machine-1', { name: 'Fan B' });

    expect(prismaMock.monitoringPoint.findMany).not.toHaveBeenCalled();
    expect(prismaMock.machine.update).toHaveBeenCalled();
  });
});

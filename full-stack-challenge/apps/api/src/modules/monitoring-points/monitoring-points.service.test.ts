import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MachineType, SensorModel as PrismaSensorModel } from '@prisma/client';
import { SensorModel } from '@dynamox/shared';
import { AppError } from '../../shared/errors';
import { associateSensor } from './monitoring-points.service';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    monitoringPoint: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    sensor: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../../lib/prisma', () => ({
  prisma: prismaMock,
}));

const now = new Date('2026-01-15T12:00:00.000Z');

function buildPumpPoint(overrides?: { sensor?: { id: string; model: PrismaSensorModel } | null }) {
  return {
    id: 'point-1',
    name: 'Bearing A',
    machineId: 'machine-1',
    createdAt: now,
    updatedAt: now,
    machine: {
      id: 'machine-1',
      name: 'Pump A',
      type: MachineType.Pump,
      createdAt: now,
      updatedAt: now,
    },
    sensor: overrides?.sensor ?? null,
  };
}

describe('associateSensor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when monitoring point does not exist', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(
      associateSensor('missing', { sensorId: 'SNS-1', model: SensorModel.HFPlus })
    ).rejects.toMatchObject({ statusCode: 404, message: 'Monitoring point not found' } satisfies Partial<AppError>);
  });

  it('returns 409 when monitoring point already has a sensor', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(
      buildPumpPoint({
        sensor: { id: 'SNS-EXISTING', model: PrismaSensorModel.HFPlus },
      })
    );

    await expect(
      associateSensor('point-1', { sensorId: 'SNS-1', model: SensorModel.HFPlus })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: 'Monitoring point already has a sensor associated',
    });
  });

  it('returns 400 when associating TcAg to a Pump machine', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(buildPumpPoint());

    await expect(
      associateSensor('point-1', { sensorId: 'SNS-1', model: SensorModel.TcAg })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('returns 400 when associating TcAs to a Pump machine', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(buildPumpPoint());

    await expect(
      associateSensor('point-1', { sensorId: 'SNS-1', model: SensorModel.TcAs })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('returns 409 when sensorId is already used', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(buildPumpPoint());
    prismaMock.sensor.findUnique.mockResolvedValue({
      id: 'SNS-1',
      model: PrismaSensorModel.HFPlus,
      monitoringPointId: 'other-point',
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      associateSensor('point-1', { sensorId: 'SNS-1', model: SensorModel.HFPlus })
    ).rejects.toMatchObject({ statusCode: 409, message: 'Sensor ID must be unique' });
  });

  it('associates HF+ to a Pump machine and returns mapped DTO', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue(buildPumpPoint());
    prismaMock.sensor.findUnique.mockResolvedValue(null);
    prismaMock.sensor.create.mockResolvedValue({
      id: 'SNS-1',
      model: PrismaSensorModel.HFPlus,
      monitoringPointId: 'point-1',
      createdAt: now,
      updatedAt: now,
    });
    prismaMock.monitoringPoint.findUniqueOrThrow.mockResolvedValue(
      buildPumpPoint({
        sensor: { id: 'SNS-1', model: PrismaSensorModel.HFPlus },
      })
    );

    const result = await associateSensor('point-1', {
      sensorId: 'SNS-1',
      model: SensorModel.HFPlus,
    });

    expect(prismaMock.sensor.create).toHaveBeenCalledWith({
      data: {
        id: 'SNS-1',
        model: PrismaSensorModel.HFPlus,
        monitoringPointId: 'point-1',
      },
    });
    expect(result).toMatchObject({
      id: 'point-1',
      name: 'Bearing A',
      machineName: 'Pump A',
      machineType: 'Pump',
      sensorId: 'SNS-1',
      sensorModel: 'HF+',
    });
  });
});

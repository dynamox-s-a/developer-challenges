import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../../shared/errors';
import {
  deleteReadings,
  getMetrics,
  listReadings,
  storeReadings,
} from './time-series.service';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    monitoringPoint: {
      findUnique: vi.fn(),
    },
    sensorReading: {
      createMany: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock('../../lib/prisma', () => ({
  prisma: prismaMock,
}));

const now = new Date('2026-01-15T12:00:00.000Z');

describe('time-series service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects storing readings when monitoring point has no sensor', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue({
      id: 'point-1',
      sensor: null,
    });

    await expect(
      storeReadings('point-1', {
        readings: [{ timestamp: now.toISOString(), value: 1.2 }],
      })
    ).rejects.toMatchObject({ statusCode: 400 } satisfies Partial<AppError>);
  });

  it('stores readings in batch when sensor exists', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue({
      id: 'point-1',
      sensor: { id: 'SNS-1' },
    });
    prismaMock.sensorReading.createMany.mockResolvedValue({ count: 2 });

    const result = await storeReadings('point-1', {
      readings: [
        { timestamp: '2026-01-15T12:00:00.000Z', value: 1 },
        { timestamp: '2026-01-15T12:01:00.000Z', value: 2 },
      ],
    });

    expect(result.insertedCount).toBe(2);
    expect(prismaMock.sensorReading.createMany).toHaveBeenCalled();
  });

  it('returns ordered readings and metrics', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue({
      id: 'point-1',
      sensor: { id: 'SNS-1' },
    });
    prismaMock.sensorReading.findMany.mockResolvedValue([
      {
        id: 'r1',
        monitoringPointId: 'point-1',
        timestamp: new Date('2026-01-15T12:00:00.000Z'),
        value: 1,
      },
      {
        id: 'r2',
        monitoringPointId: 'point-1',
        timestamp: new Date('2026-01-15T12:01:00.000Z'),
        value: 3,
      },
    ]);
    prismaMock.sensorReading.aggregate.mockResolvedValue({
      _min: { value: 1 },
      _max: { value: 3 },
      _avg: { value: 2 },
    });
    prismaMock.sensorReading.count.mockResolvedValue(2);

    const readings = await listReadings('point-1');
    const metrics = await getMetrics('point-1');

    expect(readings).toHaveLength(2);
    expect(metrics).toEqual({ count: 2, min: 1, max: 3, avg: 2 });
  });

  it('deletes readings and returns deletedCount', async () => {
    prismaMock.monitoringPoint.findUnique.mockResolvedValue({
      id: 'point-1',
      sensor: { id: 'SNS-1' },
    });
    prismaMock.sensorReading.deleteMany.mockResolvedValue({ count: 5 });

    const result = await deleteReadings('point-1');
    expect(result.deletedCount).toBe(5);
  });
});

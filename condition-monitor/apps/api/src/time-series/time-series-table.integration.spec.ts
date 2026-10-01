import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

/** The time-series and readings tables enforce their rules even when the application does not. */
describe('time-series and readings tables', () => {
  const prisma = new PrismaService();
  let fan: string;
  let point: string;
  let otherPoint: string;

  beforeEach(async () => {
    await resetDatabase(prisma);
    const { userId } = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'correct horse battery',
    });
    const sector = await prisma.sector.create({
      data: { ownerId: userId, code: 'DRY', name: 'Drying' },
    });
    fan = (
      await prisma.machine.create({
        data: { sectorId: sector.id, type: 'FAN', number: 1, name: 'Hood exhaust fan' },
      })
    ).id;
    point = (
      await prisma.monitoringPoint.create({
        data: { machineId: fan, machineType: 'FAN', location: 'FAN_MOTOR_DE', name: 'Motor' },
      })
    ).id;
    otherPoint = (
      await prisma.monitoringPoint.create({
        data: { machineId: fan, machineType: 'FAN', location: 'FAN_SHAFT_DE', name: 'Shaft' },
      })
    ).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Raw SQL, so the tests reach the database rules without any application check.
  async function series(pointId: string, quantity: string, axis: string | null) {
    const [row] = await prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO time_series (monitoring_point_id, quantity, axis, updated_at)
      VALUES (${pointId}::uuid, ${quantity}::quantity, ${axis}::axis, now())
      RETURNING id`;
    return row.id;
  }

  function reading(seriesId: string, timestamp: string, value: number | string) {
    return prisma.$executeRaw`
      INSERT INTO readings (series_id, timestamp, value)
      VALUES (${seriesId}::uuid, ${timestamp}::timestamptz, ${String(value)}::float8)`;
  }

  describe('time-series', () => {
    it('accepts vibration on every axis and temperature without one', async () => {
      for (const axis of ['H', 'V', 'A']) {
        await series(point, 'ACCELERATION_RMS', axis);
        await series(point, 'VELOCITY_RMS', axis);
      }
      await series(point, 'TEMPERATURE', null);

      expect(await prisma.timeSeries.count()).toBe(7);
    });

    it('rejects vibration without an axis and temperature with one (C10)', async () => {
      await expect(series(point, 'VELOCITY_RMS', null)).rejects.toThrow(/time_series_axis_check/);
      await expect(series(point, 'TEMPERATURE', 'H')).rejects.toThrow(/time_series_axis_check/);
    });

    it('allows one series per point, quantity and axis, even with a null axis (C1)', async () => {
      await series(point, 'VELOCITY_RMS', 'H');
      await series(point, 'TEMPERATURE', null);

      await expect(series(point, 'VELOCITY_RMS', 'H')).rejects.toThrow(
        /time_series_point_quantity_axis_key/,
      );
      await expect(series(point, 'TEMPERATURE', null)).rejects.toThrow(
        /time_series_point_quantity_axis_key/,
      );
    });

    it('accepts the same quantity and axis on another point', async () => {
      await series(point, 'TEMPERATURE', null);
      await series(otherPoint, 'TEMPERATURE', null);

      expect(await prisma.timeSeries.count()).toBe(2);
    });
  });

  describe('readings', () => {
    let velocity: string;

    beforeEach(async () => {
      velocity = await series(point, 'VELOCITY_RMS', 'H');
    });

    it('allows one reading per series and instant (C5)', async () => {
      await reading(velocity, '2026-09-29T10:00:00Z', 2.31);

      // The same instant written with another offset is the same instant.
      await expect(reading(velocity, '2026-09-29T07:00:00-03:00', 2.31)).rejects.toThrow(
        /readings_pkey/,
      );
    });

    it('accepts readings one millisecond apart, and the same instant on another series', async () => {
      const temperature = await series(point, 'TEMPERATURE', null);

      await reading(velocity, '2026-09-29T10:00:00.000Z', 2.31);
      await reading(velocity, '2026-09-29T10:00:00.001Z', 2.32);
      await reading(temperature, '2026-09-29T10:00:00.000Z', 48.2);

      expect(await prisma.reading.count()).toBe(3);
    });

    it('accepts zero, negatives and the largest finite value', async () => {
      await reading(velocity, '2026-09-29T10:00:00Z', 0);
      await reading(velocity, '2026-09-29T10:10:00Z', -12.5);
      await reading(velocity, '2026-09-29T10:20:00Z', Number.MAX_VALUE);

      expect(await prisma.reading.count()).toBe(3);
    });

    it('rejects NaN and both infinities (C4)', async () => {
      for (const value of ['NaN', 'Infinity', '-Infinity']) {
        await expect(reading(velocity, '2026-09-29T10:00:00Z', value)).rejects.toThrow(
          /readings_value_finite_check/,
        );
      }
    });

    it('rejects a reading of a series that does not exist', async () => {
      await expect(
        reading('00000000-0000-4000-8000-000000000000', '2026-09-29T10:00:00Z', 1),
      ).rejects.toThrow(/readings_series_id_fkey/);
    });
  });

  describe('what goes with what', () => {
    beforeEach(async () => {
      const velocity = await series(point, 'VELOCITY_RMS', 'H');
      await reading(velocity, '2026-09-29T10:00:00Z', 2.31);
    });

    it('keeps the series when the sensor is removed (C2)', async () => {
      await prisma.sensor.create({
        data: {
          monitoringPointId: point,
          machineType: 'FAN',
          serialNumber: 'DX-0001',
          model: 'TC_AG',
        },
      });

      await prisma.sensor.deleteMany();

      expect(await prisma.timeSeries.count()).toBe(1);
      expect(await prisma.reading.count()).toBe(1);
    });

    it('removes the readings with their series', async () => {
      await prisma.timeSeries.deleteMany();

      expect(await prisma.reading.count()).toBe(0);
    });

    it('removes series and readings with the point, and with the machine (B6)', async () => {
      await prisma.monitoringPoint.delete({ where: { id: point } });
      expect(await prisma.timeSeries.count()).toBe(0);

      const again = await series(otherPoint, 'TEMPERATURE', null);
      await reading(again, '2026-09-29T10:00:00Z', 48.2);
      await prisma.machine.delete({ where: { id: fan } });

      expect(await prisma.timeSeries.count()).toBe(0);
      expect(await prisma.reading.count()).toBe(0);
    });
  });

  describe('reading count, kept by triggers', () => {
    let velocity: string;
    let temperature: string;

    const countOf = async (id: string) =>
      (await prisma.timeSeries.findUniqueOrThrow({ where: { id } })).readingCount;

    beforeEach(async () => {
      velocity = await series(point, 'VELOCITY_RMS', 'H');
      temperature = await series(point, 'TEMPERATURE', null);
    });

    it('starts at zero and follows inserts on several series in one statement', async () => {
      expect(await countOf(velocity)).toBe(0);

      await prisma.$executeRaw`
        INSERT INTO readings (series_id, timestamp, value)
        SELECT s.id, '2026-09-29T10:00:00Z'::timestamptz + n * interval '10 minutes', 1
        FROM generate_series(1, 5) AS n, (VALUES (${velocity}::uuid), (${temperature}::uuid)) AS s(id)`;

      expect(await countOf(velocity)).toBe(5);
      expect(await countOf(temperature)).toBe(5);
    });

    it('does not count a reading skipped as already stored', async () => {
      await reading(velocity, '2026-09-29T10:00:00Z', 2.31);

      await prisma.$executeRaw`
        INSERT INTO readings (series_id, timestamp, value)
        VALUES (${velocity}::uuid, '2026-09-29T10:00:00Z', 2.31),
               (${velocity}::uuid, '2026-09-29T10:10:00Z', 2.4)
        ON CONFLICT DO NOTHING`;

      expect(await countOf(velocity)).toBe(2);
    });

    it('follows deletes, and is not touched by a failed insert', async () => {
      await reading(velocity, '2026-09-29T10:00:00Z', 1);
      await reading(velocity, '2026-09-29T10:10:00Z', 2);
      await expect(reading(velocity, '2026-09-29T10:20:00Z', 'NaN')).rejects.toThrow(
        /readings_value_finite_check/,
      );

      await prisma.$executeRaw`DELETE FROM readings WHERE value = 1`;

      expect(await countOf(velocity)).toBe(1);
    });

    it('refuses a negative count', async () => {
      await expect(
        prisma.$executeRaw`UPDATE time_series SET reading_count = -1 WHERE id = ${velocity}::uuid`,
      ).rejects.toThrow(/time_series_reading_count_check/);
    });

    it('lets a point with series and readings be deleted', async () => {
      await reading(velocity, '2026-09-29T10:00:00Z', 1);

      await prisma.monitoringPoint.delete({ where: { id: point } });

      expect(await prisma.timeSeries.count()).toBe(0);
      expect(await prisma.reading.count()).toBe(0);
    });
  });
});

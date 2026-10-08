import {
  MAX_READINGS_PAGE_SIZE,
  MAX_READINGS_PER_REQUEST,
} from '@dynapredict/shared-types';
import request from 'supertest';
import { authCookie, resetDatabase, UNKNOWN_ID } from '../../../tests/helpers';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

const app = createApp();
const cookie = authCookie();

function getReadings(
  sensorId: string,
  query: Record<string, string | number> = {},
) {
  return request(app)
    .get(`/api/v1/sensors/${sensorId}/readings`)
    .query(query)
    .set('Cookie', cookie);
}

function countReadings(sensorId: string, query: Record<string, string> = {}) {
  return request(app)
    .get(`/api/v1/sensors/${sensorId}/readings/count`)
    .query(query)
    .set('Cookie', cookie);
}

function getMetrics(sensorId: string, query: Record<string, string> = {}) {
  return request(app)
    .get(`/api/v1/sensors/${sensorId}/readings/metrics`)
    .query(query)
    .set('Cookie', cookie);
}

function deleteReadings(sensorId: string, query: Record<string, string> = {}) {
  return request(app)
    .delete(`/api/v1/sensors/${sensorId}/readings`)
    .query(query)
    .set('Cookie', cookie);
}

function getPrediction(
  sensorId: string,
  query: Record<string, string | number> = {},
) {
  return request(app)
    .get(`/api/v1/sensors/${sensorId}/readings/prediction`)
    .query(query)
    .set('Cookie', cookie);
}

function postReadings(sensorId: string, body: object) {
  return request(app)
    .post(`/api/v1/sensors/${sensorId}/readings`)
    .set('Cookie', cookie)
    .send(body);
}

/** A Fan machine with one point per serial number, each with an HF+ sensor. */
async function createSensors(...serialNumbers: string[]) {
  const machine = await prisma.machine.create({
    data: {
      name: 'Ventilador 01',
      type: 'Fan',
      monitoringPoints: {
        create: serialNumbers.map((serialNumber) => ({
          name: `Ponto ${serialNumber}`,
          sensor: { create: { serialNumber, model: 'HFPlus' } },
        })),
      },
    },
    select: { monitoringPoints: { select: { sensor: true } } },
  });
  return machine.monitoringPoints.map((point) => point.sensor!);
}

/** `count` readings one minute apart, starting at 2026-10-03T12:00Z. */
function series(count: number, start = Date.UTC(2026, 9, 3, 12)) {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(start + i * 60_000).toISOString(),
    value: i + 0.5,
  }));
}

/** Stores `series(count)` for the sensor directly, bypassing the API. */
async function seedReadings(sensorId: string, count: number) {
  const readings = series(count);
  await prisma.reading.createMany({
    data: readings.map((reading) => ({
      sensorId,
      timestamp: new Date(reading.timestamp),
      value: reading.value,
    })),
  });
  return readings;
}

/** Stores the values one minute apart, timestamped like `series()`. */
async function seedValues(sensorId: string, values: number[]) {
  await prisma.reading.createMany({
    data: values.map((value, i) => ({
      sensorId,
      timestamp: new Date(minute(i)),
      value,
    })),
  });
}

/** The ISO timestamp of the i-th reading of `series()`. */
function minute(i: number) {
  return series(i + 1)[i].timestamp;
}

function storedReadings(sensorId: string) {
  return prisma.reading.findMany({
    where: { sensorId },
    orderBy: { timestamp: 'asc' },
    select: { timestamp: true, value: true },
  });
}

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

describe('POST /api/v1/sensors/:sensorId/readings', () => {
  it('requires a session', async () => {
    const res = await request(app)
      .post(`/api/v1/sensors/${UNKNOWN_ID}/readings`)
      .send({ readings: series(1) });

    expect(res.status).toBe(401);
  });

  it('stores a batch and reports what was inserted', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await postReadings(sensor.id, {
      readings: [
        { timestamp: '2026-10-03T12:00:00Z', value: 1.25 },
        // Another offset: stored as 12:01 UTC.
        { timestamp: '2026-10-03T09:01:00-03:00', value: -3 },
        { timestamp: '2026-10-03T12:02:00.123Z', value: 0 },
      ],
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ received: 3, inserted: 3, duplicates: 0 });
    expect(await storedReadings(sensor.id)).toEqual([
      { timestamp: new Date('2026-10-03T12:00:00Z'), value: 1.25 },
      { timestamp: new Date('2026-10-03T12:01:00Z'), value: -3 },
      { timestamp: new Date('2026-10-03T12:02:00.123Z'), value: 0 },
    ]);
  });

  it('is idempotent: re-sending a batch inserts nothing and answers 200', async () => {
    const [sensor] = await createSensors('HFP-1');
    await postReadings(sensor.id, { readings: series(3) });

    const res = await postReadings(sensor.id, { readings: series(3) });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: 3, inserted: 0, duplicates: 3 });
    expect(await prisma.reading.count()).toBe(3);
  });

  it('inserts only the new readings of an overlapping batch, keeping the stored values', async () => {
    const [sensor] = await createSensors('HFP-1');
    await postReadings(sensor.id, { readings: series(2) });

    const overlapping = series(3).map((reading) => ({
      ...reading,
      value: 99,
    }));
    const res = await postReadings(sensor.id, { readings: overlapping });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ received: 3, inserted: 1, duplicates: 2 });
    expect((await storedReadings(sensor.id)).map((r) => r.value)).toEqual([
      0.5, 1.5, 99,
    ]);
  });

  it('counts repeated instants inside one batch as duplicates', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await postReadings(sensor.id, {
      readings: [
        { timestamp: '2026-10-03T12:00:00Z', value: 1 },
        { timestamp: '2026-10-03T12:00:00+00:00', value: 2 },
      ],
    });

    expect(res.body).toEqual({ received: 2, inserted: 1, duplicates: 1 });
  });

  it('lets different sensors have readings at the same instant', async () => {
    const [first, second] = await createSensors('HFP-1', 'HFP-2');

    await postReadings(first.id, { readings: series(2) });
    const res = await postReadings(second.id, { readings: series(2) });

    expect(res.body.inserted).toBe(2);
    expect(await prisma.reading.count()).toBe(4);
  });

  it(`accepts a full batch of ${MAX_READINGS_PER_REQUEST} readings`, async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await postReadings(sensor.id, {
      readings: series(MAX_READINGS_PER_REQUEST),
    });

    expect(res.status).toBe(201);
    expect(res.body.inserted).toBe(MAX_READINGS_PER_REQUEST);
  });

  it('returns 404 for an unknown sensor and stores nothing', async () => {
    const res = await postReadings(UNKNOWN_ID, { readings: series(2) });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
    expect(await prisma.reading.count()).toBe(0);
  });

  it.each([
    ['an empty batch', { readings: [] }],
    ['a missing readings field', {}],
    [
      `more than ${MAX_READINGS_PER_REQUEST} readings`,
      { readings: series(MAX_READINGS_PER_REQUEST + 1) },
    ],
    [
      'a timestamp without offset',
      { readings: [{ timestamp: '2026-10-03T12:00:00', value: 1 }] },
    ],
    [
      'a timestamp that is not a date',
      { readings: [{ timestamp: 'yesterday', value: 1 }] },
    ],
    [
      'a numeric string value',
      { readings: [{ timestamp: '2026-10-03T12:00:00Z', value: '1' }] },
    ],
    [
      'a null value',
      { readings: [{ timestamp: '2026-10-03T12:00:00Z', value: null }] },
    ],
  ])('rejects %s with 400', async (_, body) => {
    const [sensor] = await createSensors('HFP-1');

    const res = await postReadings(sensor.id, body);

    expect(res.status).toBe(400);
    expect(await prisma.reading.count()).toBe(0);
  });

  it('rejects a whole batch when any reading is invalid', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await postReadings(sensor.id, {
      readings: [...series(2), { timestamp: 'bad', value: 1 }],
    });

    expect(res.status).toBe(400);
    expect(res.body.error.details).toEqual([
      expect.objectContaining({ path: 'readings.2.timestamp' }),
    ]);
    expect(await prisma.reading.count()).toBe(0);
  });

  it('rejects a sensor id that is not a uuid with 400', async () => {
    const res = await postReadings('42', { readings: series(1) });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/sensors/:sensorId/readings', () => {
  it('requires a session', async () => {
    const res = await request(app).get(
      `/api/v1/sensors/${UNKNOWN_ID}/readings`,
    );

    expect(res.status).toBe(401);
  });

  it('returns the whole series oldest first when it fits in one page', async () => {
    const [sensor] = await createSensors('HFP-1');
    // Inserted newest first, to prove the response is sorted.
    const readings = series(3);
    await prisma.reading.createMany({
      data: [...readings].reverse().map((reading) => ({
        sensorId: sensor.id,
        timestamp: new Date(reading.timestamp),
        value: reading.value,
      })),
    });

    const res = await getReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: readings,
      meta: { limit: 1000, nextCursor: null },
    });
  });

  it('pages with limit and the nextCursor as after', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 5);

    const first = await getReadings(sensor.id, { limit: 2 });
    const second = await getReadings(sensor.id, {
      limit: 2,
      after: first.body.meta.nextCursor,
    });
    const last = await getReadings(sensor.id, {
      limit: 2,
      after: second.body.meta.nextCursor,
    });

    expect(first.body.data).toEqual(readings.slice(0, 2));
    expect(first.body.meta).toEqual({ limit: 2, nextCursor: minute(1) });
    expect(second.body.data).toEqual(readings.slice(2, 4));
    expect(second.body.meta.nextCursor).toBe(minute(3));
    expect(last.body.data).toEqual(readings.slice(4));
    expect(last.body.meta.nextCursor).toBeNull();
  });

  it('ends without an empty trailing page when the series fills the last page exactly', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedReadings(sensor.id, 4);

    const second = await getReadings(sensor.id, {
      limit: 2,
      after: minute(1),
    });

    expect(second.body.data).toHaveLength(2);
    expect(second.body.meta.nextCursor).toBeNull();
  });

  it('returns every reading exactly once when following the cursor', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 23);

    const collected: unknown[] = [];
    let after: string | null | undefined;
    do {
      const res = await getReadings(sensor.id, {
        limit: 5,
        ...(after ? { after } : {}),
      });
      collected.push(...res.body.data);
      after = res.body.meta.nextCursor;
    } while (after);

    expect(collected).toEqual(readings);
  });

  it('filters by an inclusive from/to range', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 6);

    const res = await getReadings(sensor.id, {
      from: minute(1),
      to: minute(3),
    });

    expect(res.body.data).toEqual(readings.slice(1, 4));
  });

  it('accepts a range of a single instant', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 3);

    const res = await getReadings(sensor.id, {
      from: minute(1),
      to: minute(1),
    });

    expect(res.body.data).toEqual([readings[1]]);
  });

  it('combines a range with the cursor', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 10);
    const range = { from: minute(2), to: minute(6) };

    const first = await getReadings(sensor.id, { ...range, limit: 3 });
    const second = await getReadings(sensor.id, {
      ...range,
      limit: 3,
      after: first.body.meta.nextCursor,
    });

    expect(first.body.data).toEqual(readings.slice(2, 5));
    expect(second.body.data).toEqual(readings.slice(5, 7));
    expect(second.body.meta.nextCursor).toBeNull();
  });

  it("returns only the requested sensor's readings", async () => {
    const [first, second] = await createSensors('HFP-1', 'HFP-2');
    await seedReadings(first.id, 2);
    await seedReadings(second.id, 3);

    const res = await getReadings(first.id);

    expect(res.body.data).toHaveLength(2);
  });

  it('returns an empty page for a sensor without readings', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await getReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      meta: { limit: 1000, nextCursor: null },
    });
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await getReadings(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });

  it.each([
    ['from after to', { from: minute(2), to: minute(1) }],
    ['a from without offset', { from: '2026-10-03T12:00:00' }],
    ['an invalid after cursor', { after: 'next' }],
    ['limit 0', { limit: 0 }],
    [
      `a limit over ${MAX_READINGS_PAGE_SIZE}`,
      { limit: MAX_READINGS_PAGE_SIZE + 1 },
    ],
  ])('rejects %s with 400', async (_, query) => {
    const [sensor] = await createSensors('HFP-1');

    const res = await getReadings(sensor.id, query);

    expect(res.status).toBe(400);
  });

  it('rejects a sensor id that is not a uuid with 400', async () => {
    const res = await getReadings('42');

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/sensors/:sensorId/readings/count', () => {
  it('requires a session', async () => {
    const res = await request(app).get(
      `/api/v1/sensors/${UNKNOWN_ID}/readings/count`,
    );

    expect(res.status).toBe(401);
  });

  it("counts all of the sensor's readings", async () => {
    const [sensor, other] = await createSensors('HFP-1', 'HFP-2');
    await seedReadings(sensor.id, 7);
    await seedReadings(other.id, 3);

    const res = await countReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 7 });
  });

  it('counts within an inclusive from/to range', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedReadings(sensor.id, 10);

    const res = await countReadings(sensor.id, {
      from: minute(2),
      to: minute(5),
    });

    expect(res.body).toEqual({ count: 4 });
  });

  it.each([
    ['only from', { from: minute(7) }, 3],
    ['only to', { to: minute(2) }, 3],
  ])('accepts an open-ended range with %s', async (_, query, expected) => {
    const [sensor] = await createSensors('HFP-1');
    await seedReadings(sensor.id, 10);

    const res = await countReadings(sensor.id, query);

    expect(res.body).toEqual({ count: expected });
  });

  it('agrees with the uploads: duplicates are not counted twice', async () => {
    const [sensor] = await createSensors('HFP-1');
    await postReadings(sensor.id, { readings: series(3) });
    await postReadings(sensor.id, { readings: series(5) });

    const res = await countReadings(sensor.id);

    expect(res.body).toEqual({ count: 5 });
  });

  it('returns zero for a sensor without readings', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await countReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 0 });
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await countReadings(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });

  it.each([
    ['from after to', { from: minute(2), to: minute(1) }],
    ['a to that is not a date', { to: 'now' }],
  ])('rejects %s with 400', async (_, query) => {
    const [sensor] = await createSensors('HFP-1');

    const res = await countReadings(sensor.id, query);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/sensors/:sensorId/readings/metrics', () => {
  // min and max sit away from the ends of the series, and one value is negative.
  const VALUES = [4, -2, 10, 7, 1];

  it('requires a session', async () => {
    const res = await request(app).get(
      `/api/v1/sensors/${UNKNOWN_ID}/readings/metrics`,
    );

    expect(res.status).toBe(401);
  });

  it('aggregates the whole series', async () => {
    const [sensor, other] = await createSensors('HFP-1', 'HFP-2');
    await seedValues(sensor.id, VALUES);
    await seedValues(other.id, [100, -100]);

    const res = await getMetrics(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      count: 5,
      min: -2,
      max: 10,
      avg: 4,
      firstTimestamp: minute(0),
      lastTimestamp: minute(4),
    });
  });

  it('aggregates only an inclusive from/to range', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, VALUES);

    const res = await getMetrics(sensor.id, { from: minute(2), to: minute(4) });

    expect(res.body).toEqual({
      count: 3,
      min: 1,
      max: 10,
      avg: 6,
      firstTimestamp: minute(2),
      lastTimestamp: minute(4),
    });
  });

  it('keeps fractional averages', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, [0.1, 0.2, 0.4]);

    const res = await getMetrics(sensor.id);

    expect(res.body.avg).toBeCloseTo(0.7 / 3, 10);
  });

  it('reports a single reading as min, max and avg', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, [3.5]);

    const res = await getMetrics(sensor.id);

    expect(res.body).toMatchObject({ count: 1, min: 3.5, max: 3.5, avg: 3.5 });
    expect(res.body.firstTimestamp).toBe(res.body.lastTimestamp);
  });

  it('returns nulls, not zeros, for a sensor without readings', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await getMetrics(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      count: 0,
      min: null,
      max: null,
      avg: null,
      firstTimestamp: null,
      lastTimestamp: null,
    });
  });

  it('returns nulls for a range without readings', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, VALUES);

    const res = await getMetrics(sensor.id, { from: minute(10) });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ count: 0, avg: null });
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await getMetrics(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });

  it('rejects from after to with 400', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await getMetrics(sensor.id, { from: minute(2), to: minute(1) });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/v1/sensors/:sensorId/readings', () => {
  it('requires a session', async () => {
    const res = await request(app).delete(
      `/api/v1/sensors/${UNKNOWN_ID}/readings`,
    );

    expect(res.status).toBe(401);
  });

  it("deletes the whole series, keeping the sensor and other sensors' readings", async () => {
    const [sensor, other] = await createSensors('HFP-1', 'HFP-2');
    await seedReadings(sensor.id, 5);
    await seedReadings(other.id, 3);

    const res = await deleteReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: 5 });
    expect(await prisma.reading.count({ where: { sensorId: sensor.id } })).toBe(
      0,
    );
    expect(await prisma.reading.count({ where: { sensorId: other.id } })).toBe(
      3,
    );
    expect(await prisma.sensor.count({ where: { id: sensor.id } })).toBe(1);
  });

  it('deletes only an inclusive from/to range', async () => {
    const [sensor] = await createSensors('HFP-1');
    const readings = await seedReadings(sensor.id, 6);

    const res = await deleteReadings(sensor.id, {
      from: minute(1),
      to: minute(3),
    });

    expect(res.body).toEqual({ deleted: 3 });
    const left = await getReadings(sensor.id);
    expect(left.body.data).toEqual([readings[0], readings[4], readings[5]]);
  });

  it('deletes an open-ended range', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedReadings(sensor.id, 6);

    const res = await deleteReadings(sensor.id, { from: minute(4) });

    expect(res.body).toEqual({ deleted: 2 });
  });

  it('leaves the count at zero, as the delete flow expects', async () => {
    const [sensor] = await createSensors('HFP-1');
    await postReadings(sensor.id, { readings: series(4) });
    const before = await countReadings(sensor.id);

    const res = await deleteReadings(sensor.id);
    const after = await countReadings(sensor.id);

    expect(res.body.deleted).toBe(before.body.count);
    expect(after.body).toEqual({ count: 0 });
  });

  it('lets the same readings be uploaded again after a delete', async () => {
    const [sensor] = await createSensors('HFP-1');
    await postReadings(sensor.id, { readings: series(3) });
    await deleteReadings(sensor.id);

    const res = await postReadings(sensor.id, { readings: series(3) });

    expect(res.body).toEqual({ received: 3, inserted: 3, duplicates: 0 });
  });

  it('answers 200 with zero when there is nothing to delete', async () => {
    const [sensor] = await createSensors('HFP-1');

    const res = await deleteReadings(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: 0 });
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await deleteReadings(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });

  it.each([
    ['from after to', { from: minute(2), to: minute(1) }],
    ['a from that is not a date', { from: 'last week' }],
  ])('rejects %s with 400 and deletes nothing', async (_, query) => {
    const [sensor] = await createSensors('HFP-1');
    await seedReadings(sensor.id, 3);

    const res = await deleteReadings(sensor.id, query);

    expect(res.status).toBe(400);
    expect(await prisma.reading.count()).toBe(3);
  });
});

describe('GET /api/v1/sensors/:sensorId/readings/prediction', () => {
  it('requires a session', async () => {
    const res = await request(app).get(
      `/api/v1/sensors/${UNKNOWN_ID}/readings/prediction`,
    );

    expect(res.status).toBe(401);
  });

  it('forecasts the moving average of the latest 5 readings by default', async () => {
    const [sensor] = await createSensors('HFP-1');
    // The outlier at minute 0 falls outside the window of the last 5.
    await seedValues(sensor.id, [1000, 1, 2, 3, 4, 5]);

    const res = await getPrediction(sensor.id);

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      method: 'movingAverage',
      window: 5,
      used: 5,
      horizon: 10,
    });
    expect(res.body.data).toHaveLength(10);
    expect(res.body.data[0]).toEqual({ timestamp: minute(6), value: 3 });
    expect(res.body.data[9]).toEqual({ timestamp: minute(15), value: 3 });
  });

  it('extrapolates the trend with linear regression', async () => {
    const [sensor] = await createSensors('HFP-1');
    // value = 2 + 1.5 per minute
    await seedValues(sensor.id, [2, 3.5, 5, 6.5]);

    const res = await getPrediction(sensor.id, {
      method: 'linearRegression',
      window: 4,
      horizon: 2,
    });

    expect(res.status).toBe(200);
    expect(
      res.body.data.map((p: { timestamp: string }) => p.timestamp),
    ).toEqual([minute(4), minute(5)]);
    expect(res.body.data[0].value).toBeCloseTo(8, 9);
    expect(res.body.data[1].value).toBeCloseTo(9.5, 9);
  });

  it('uses every reading when the series is shorter than the window', async () => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, [1, 2, 6]);

    const res = await getPrediction(sensor.id, { window: 50, horizon: 1 });

    expect(res.body.meta).toMatchObject({ window: 50, used: 3 });
    expect(res.body.data).toEqual([{ timestamp: minute(3), value: 3 }]);
  });

  it.each([
    ['no readings', []],
    ['a single reading', [5]],
  ])('answers 422 for a sensor with %s', async (_, values) => {
    const [sensor] = await createSensors('HFP-1');
    await seedValues(sensor.id, values);

    const res = await getPrediction(sensor.id);

    expect(res.status).toBe(422);
    expect(res.body.error).toEqual({
      code: 'BUSINESS_RULE_VIOLATION',
      message: 'A prediction needs at least 2 readings',
      details: { readings: values.length },
    });
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await getPrediction(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });

  it.each([
    ['an unknown method', { method: 'arima' }],
    ['a window of 1', { window: 1 }],
    ['a horizon of 0', { horizon: 0 }],
    ['a horizon over the maximum', { horizon: 501 }],
  ])('rejects %s with 400', async (_, query) => {
    const [sensor] = await createSensors('HFP-1');

    const res = await getPrediction(sensor.id, query);

    expect(res.status).toBe(400);
  });
});

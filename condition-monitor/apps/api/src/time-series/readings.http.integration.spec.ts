import type { IngestionReport, Machine, MonitoringPoint } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  type: string;
  detail: string;
  errors: Record<string, unknown>[];
}

const T0 = '2026-09-29T10:00:00.000Z';

function reading(
  serialNumber: string,
  overrides: Partial<{
    timestamp: string;
    quantity: string;
    axis: string | null;
    value: number;
  }> = {},
) {
  return {
    serialNumber,
    timestamp: T0,
    quantity: 'velocity_rms',
    axis: 'H',
    value: 2.31,
    ...overrides,
  };
}

/** Readings sent as JSON (assumptions C3, C4, C5, C8, C11). */
describe('readings over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let pumpPoint: MonitoringPoint;
  let fanPoint: MonitoringPoint;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    other = (await http.loginAs('other@plant.test')).request;
    const sector = await readJson<{ id: string }>(
      await operator('POST', '/sectors', { code: 'DRY', name: 'Drying' }),
    );
    const point = async (type: string, location: string, serialNumber: string, model: string) => {
      const machine = await readJson<Machine>(
        await operator('POST', '/machines', { sectorId: sector.id, type, number: 1, name: type }),
      );
      const [created] = (
        await readJson<{ items: MonitoringPoint[] }>(
          await operator('POST', `/machines/${machine.id}/monitoring-points`, {
            positions: [{ location }],
          }),
        )
      ).items;
      await operator('PUT', `/monitoring-points/${created.id}/sensor`, { serialNumber, model });
      return created;
    };
    pumpPoint = await point('Pump', 'PUMP_MOTOR_DE', 'DX-0001', 'HF+');
    fanPoint = await point('Fan', 'FAN_MOTOR_DE', 'DX-0002', 'TcAg');
  });

  afterAll(async () => {
    await http.app.close();
  });

  const send = (readings: unknown[], client = operator) =>
    client('POST', '/readings', { readings });
  const readingCount = () => http.prisma.reading.count();

  it('stores the readings, creating each series on its first reading, with a report per sensor', async () => {
    const response = await send([
      reading('DX-0002', { quantity: 'acceleration_rms', axis: 'A', value: 0.8 }),
      reading('DX-0001'),
      reading('DX-0001', { axis: 'V', value: 1.9 }),
      reading('DX-0001', { timestamp: '2026-09-29T10:10:00Z', value: 2.4 }),
      reading('DX-0001', { quantity: 'temperature', axis: null, value: 48.2 }),
    ]);

    expect(response.status).toBe(200);
    expect(await readJson<IngestionReport>(response)).toEqual({
      sensors: [
        {
          serialNumber: 'DX-0001',
          monitoringPointId: pumpPoint.id,
          seriesCreated: 3,
          readingsInserted: 4,
          readingsRepeated: 0,
        },
        {
          serialNumber: 'DX-0002',
          monitoringPointId: fanPoint.id,
          seriesCreated: 1,
          readingsInserted: 1,
          readingsRepeated: 0,
        },
      ],
      totals: { seriesCreated: 4, readingsInserted: 5, readingsRepeated: 0 },
    });
    expect(await http.prisma.timeSeries.count()).toBe(4);
  });

  it('ignores and counts readings sent again, even with another offset (C5)', async () => {
    await send([reading('DX-0001'), reading('DX-0001', { axis: 'V' })]);

    const again = await send([
      reading('DX-0001', { timestamp: '2026-09-29T07:00:00-03:00' }),
      reading('DX-0001', { axis: 'V' }),
      reading('DX-0001', { timestamp: '2026-09-29T10:10:00Z' }),
    ]);

    expect((await readJson<IngestionReport>(again)).totals).toEqual({
      seriesCreated: 0,
      readingsInserted: 1,
      readingsRepeated: 2,
    });
    expect(await readingCount()).toBe(3);
  });

  it('refuses the whole submission when a stored instant gets another value (C4, C5)', async () => {
    await send([reading('DX-0001')]);

    const response = await send([
      reading('DX-0001', { timestamp: '2026-09-29T10:10:00Z' }),
      reading('DX-0002', { quantity: 'temperature', axis: null, value: 40 }),
      reading('DX-0001', { value: 2.32 }),
    ]);

    expect(response.status).toBe(422);
    expect(await readJson<ErrorBody>(response)).toMatchObject({
      type: 'urn:condition-monitor:error:import',
      detail: '1 reading is invalid. Nothing was stored.',
      errors: [
        {
          index: 2,
          field: 'value',
          message: 'Conflicts with the stored value 2.31 at the same timestamp.',
        },
      ],
    });
    expect(await readingCount()).toBe(1);
    // The series the refused submission created is undone too.
    expect(await http.prisma.timeSeries.count()).toBe(1);
  });

  it('counts a reading repeated in one submission, and refuses it with another value', async () => {
    const repeated = await send([reading('DX-0001'), reading('DX-0001')]);
    expect((await readJson<IngestionReport>(repeated)).totals).toMatchObject({
      readingsInserted: 1,
      readingsRepeated: 1,
    });

    const conflicting = await send([
      reading('DX-0001', { timestamp: '2026-09-29T11:00:00Z' }),
      reading('DX-0001', { timestamp: '2026-09-29T11:00:00Z', value: 9 }),
    ]);
    expect((await readJson<ErrorBody>(conflicting)).errors).toEqual([
      {
        index: 1,
        field: 'value',
        message: 'Same series and timestamp as index 0, with another value: 2.31.',
      },
    ]);
  });

  it('refuses a serial number that is unknown, removed or of another user alike (A4)', async () => {
    await operator('DELETE', `/monitoring-points/${fanPoint.id}/sensor`);

    const response = await send([reading('DX-0001'), reading('DX-0002'), reading('DX-9999')]);
    const byOther = await send([reading('DX-0001')], other);

    expect(response.status).toBe(422);
    expect((await readJson<ErrorBody>(response)).errors).toEqual([
      {
        index: 1,
        field: 'serialNumber',
        message: 'No installed sensor with serial number DX-0002.',
      },
      {
        index: 2,
        field: 'serialNumber',
        message: 'No installed sensor with serial number DX-9999.',
      },
    ]);
    expect(byOther.status).toBe(422);
    expect(await readingCount()).toBe(0);
  });

  it('keeps the history on the point when its sensor is replaced (C2, B14)', async () => {
    await send([reading('DX-0001')]);
    await operator('PUT', `/monitoring-points/${pumpPoint.id}/sensor`, {
      serialNumber: 'DX-0003',
      model: 'HF+',
    });

    const response = await send([reading('DX-0003', { timestamp: '2026-09-29T10:10:00Z' })]);

    expect((await readJson<IngestionReport>(response)).sensors[0]).toMatchObject({
      monitoringPointId: pumpPoint.id,
      seriesCreated: 0,
      readingsInserted: 1,
    });
    expect(await http.prisma.timeSeries.count()).toBe(1);
  });

  it('names each invalid reading by index and field, counting readings, not errors', async () => {
    const response = await send([
      reading('DX-0001'),
      reading('DX-0001', { timestamp: '2026-09-29T10:00:00' }),
      reading('DX-0001', { quantity: 'temperature', value: Number.NaN }),
    ]);

    expect(response.status).toBe(422);
    const body = await readJson<ErrorBody>(response);
    expect(body.detail).toBe('2 readings are invalid. Nothing was stored.');
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ index: 1, field: 'timestamp' }),
        expect.objectContaining({ index: 2, field: 'value' }),
      ]),
    );
  });

  it('lists the first 100 errors and counts them all', async () => {
    const readings = Array.from({ length: 150 }, (_, minute) =>
      reading('DX-9999', { timestamp: new Date(Date.parse(T0) + minute * 60_000).toISOString() }),
    );

    const body = await readJson<ErrorBody>(await send(readings));

    expect(body.detail).toBe(
      '150 readings are invalid. Nothing was stored. The first 100 errors are listed.',
    );
    expect(body.errors).toHaveLength(100);
  });

  it('refuses an empty submission and a body without readings', async () => {
    expect((await readJson<ErrorBody>(await send([]))).errors).toEqual([
      { field: 'readings', message: 'Send at least one reading.' },
    ]);
    expect((await operator('POST', '/readings', { reading: [] })).status).toBe(422);
  });

  it(`accepts a series up to 50,000 readings and refuses the one past it (C8)`, async () => {
    await send([reading('DX-0001')]);
    const series = await http.prisma.timeSeries.findFirstOrThrow();
    // 49,998 more, one per minute after T0, written directly to keep the test fast.
    await http.prisma.$executeRaw`
      INSERT INTO readings (series_id, timestamp, value)
      SELECT ${series.id}::uuid, ${T0}::timestamptz + n * interval '1 minute', 1
      FROM generate_series(1, 49998) AS n`;
    const minute = (n: number) => new Date(Date.parse(T0) + n * 60_000).toISOString();

    const last = await send([reading('DX-0001', { timestamp: minute(49_999) })]);
    const past = await send([reading('DX-0001', { timestamp: minute(50_000) })]);

    expect(last.status).toBe(200);
    expect(past.status).toBe(422);
    expect((await readJson<ErrorBody>(past)).errors).toEqual([
      {
        field: 'readings',
        message:
          'DX-0001, Velocity RMS, horizontal: would hold 50,001 readings, above the limit of 50,000 per series.',
      },
    ]);
    expect(await readingCount()).toBe(50_000);
  });

  it('accepts 2,000 readings in one submission, a body above the default of Express, and refuses 2,001', async () => {
    const readings = Array.from({ length: 2_001 }, (_, n) =>
      reading('DX-0001', { timestamp: new Date(Date.parse(T0) + n * 600_000).toISOString() }),
    );

    const atLimit = await send(readings.slice(0, 2_000));
    const over = await send(readings);

    expect(atLimit.status).toBe(200);
    expect(over.status).toBe(422);
    expect((await readJson<ErrorBody>(over)).errors).toEqual([
      { field: 'readings', message: 'At most 2,000 readings per submission.' },
    ]);
    expect(await readingCount()).toBe(2_000);
  });

  it('refuses a body over 2 MB with 413', async () => {
    const response = await operator('POST', '/readings', { padding: 'x'.repeat(2_100_000) });

    expect(response.status).toBe(413);
    expect(response.headers.get('content-type')).toMatch(/application\/problem\+json/);
  });

  it('requires a session', async () => {
    expect((await send([reading('DX-0001')], http.anonymous)).status).toBe(401);
  });

  describe('two submissions at the same time', () => {
    it('both reach a new series, created once', async () => {
      const [a, b] = await Promise.all([
        send([reading('DX-0001')]),
        send([reading('DX-0001', { timestamp: '2026-09-29T10:10:00Z' })]),
      ]);

      expect([a.status, b.status]).toEqual([200, 200]);
      expect(await http.prisma.timeSeries.count()).toBe(1);
      expect(await readingCount()).toBe(2);
    });

    it('with two values for one instant: one is stored, the other refused', async () => {
      const answers = await Promise.all([
        send([reading('DX-0001', { value: 1 })]),
        send([reading('DX-0001', { value: 2 })]),
      ]);

      expect(answers.map((answer) => answer.status).sort()).toEqual([200, 422]);
      expect(await readingCount()).toBe(1);
    });
  });
});

import type { Forecast, Machine, MonitoringPoint } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

const T0 = '2026-09-01T00:00:00Z';
const HOUR = 3_600_000;

/** The forecast of a time-series (challenge, section 8; docs/forecast-study.md). */
describe('forecast over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let seriesId: string;

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
    const fan = await readJson<Machine>(
      await operator('POST', '/machines', {
        sectorId: sector.id,
        type: 'Fan',
        number: 1,
        name: 'Fan',
      }),
    );
    const [point] = (
      await readJson<{ items: MonitoringPoint[] }>(
        await operator('POST', `/machines/${fan.id}/monitoring-points`, {
          positions: [{ location: 'FAN_MOTOR_DE' }],
        }),
      )
    ).items;
    const series = await http.prisma.timeSeries.create({
      data: { monitoringPointId: point.id, quantity: 'VELOCITY_RMS', axis: 'H' },
    });
    seriesId = series.id;
  });

  afterAll(async () => {
    await http.app.close();
  });

  /** One reading every 10 minutes from T0: a daily cycle around 2 mm/s, slightly uneven. */
  const store = (readings: number) => http.prisma.$executeRaw`
    INSERT INTO readings (series_id, timestamp, value)
    SELECT ${seriesId}::uuid,
           ${T0}::timestamptz + n * interval '10 minutes',
           2 + 0.5 * sin(2 * pi() * n / 144.0) + 0.05 * sin(n * 12.9898)
    FROM generate_series(0, ${readings - 1}::int) AS n`;

  const forecast = async (client = operator, id = seriesId) =>
    client('GET', `/time-series/${id}/forecast`);

  it('predicts the 24 hours after the latest reading, with a band and its measured error', async () => {
    // 10 days and 3 readings into the next hour, which is left out as incomplete.
    await store(10 * 144 + 3);

    const response = await forecast();
    const body = await readJson<Forecast>(response);

    expect(response.status).toBe(200);
    if (body.status !== 'available') throw new Error(body.detail);
    expect(body.basedOn).toEqual({
      from: '2026-09-01T00:00:00.000Z',
      to: '2026-09-11T00:00:00.000Z',
      hours: 240,
    });
    expect(body.points).toHaveLength(24);
    expect(body.points[0].timestamp).toBe('2026-09-11T00:30:00.000Z');
    expect(body.points[23].timestamp).toBe('2026-09-11T23:30:00.000Z');
    for (const point of body.points) {
      expect(point.lower).toBeLessThanOrEqual(point.value);
      expect(point.upper).toBeGreaterThanOrEqual(point.value);
      // The cycle stays between 1.4 and 2.6; a forecast far from it would be wrong.
      expect(point.value).toBeGreaterThan(1.3);
      expect(point.value).toBeLessThan(2.7);
    }
    expect(body.validation.forecasts).toBe(25);
    expect(body.validation.error).toBeLessThan(body.validation.baselineError);
  });

  it('answers that there is no forecast, and why, with less than a week of history', async () => {
    await store(2 * 144);

    const response = await forecast();

    expect(response.status).toBe(200);
    expect(await readJson<Forecast>(response)).toEqual({
      status: 'unavailable',
      reason: 'not-enough-history',
      detail:
        'The series has 47 hours of continuous history up to its latest reading; a forecast needs 168.',
    });
  });

  it('answers the same for a series without readings', async () => {
    expect(await readJson<Forecast>(await forecast())).toMatchObject({
      status: 'unavailable',
      reason: 'not-enough-history',
    });
  });

  it('does not bridge a gap: only the hours after it count', async () => {
    await store(10 * 144 + 3);
    // One hour without readings, three days before the end.
    const gap = new Date(Date.parse(T0) + 7 * 24 * HOUR);
    await http.prisma.reading.deleteMany({
      where: { timestamp: { gte: gap, lt: new Date(gap.getTime() + HOUR) } },
    });

    const body = await readJson<Forecast>(await forecast());

    expect(body.status === 'unavailable' && body.detail).toMatch(/^The series has 71 hours/);
  });

  it('answers the kept forecast while the series is unchanged, and a new one after a reading', async () => {
    await store(10 * 144 + 3);
    const first = await readJson<Forecast>(await forecast());

    const again = await readJson<Forecast>(await forecast());
    // Six more readings complete the hour that was left out: the history grows by one.
    await http.prisma.$executeRaw`
      INSERT INTO readings (series_id, timestamp, value)
      SELECT ${seriesId}::uuid, ${T0}::timestamptz + n * interval '10 minutes', 2
      FROM generate_series(10 * 144 + 3, 10 * 144 + 8) AS n`;
    const after = await readJson<Forecast>(await forecast());

    expect(again).toEqual(first);
    expect(first.status === 'available' && first.basedOn.to).toBe('2026-09-11T00:00:00.000Z');
    expect(after.status === 'available' && after.basedOn.to).toBe('2026-09-11T01:00:00.000Z');
  });

  it('computes again after readings are removed', async () => {
    await store(10 * 144 + 3);
    await forecast();

    await http.prisma.reading.deleteMany({
      where: { timestamp: { gte: new Date(Date.parse(T0) + 3 * 24 * HOUR) } },
    });

    expect(await readJson<Forecast>(await forecast())).toMatchObject({ status: 'unavailable' });
  });

  it('hides the series of another user, and answers 404 for an id that is not one', async () => {
    await store(10 * 144 + 3);
    // Asked by its owner first: a kept forecast must stay hidden from anyone else.
    expect((await forecast()).status).toBe(200);

    expect((await forecast(other)).status).toBe(404);
    expect((await forecast(operator, 'not-a-uuid')).status).toBe(404);
    expect((await forecast(http.anonymous)).status).toBe(401);
  });
});

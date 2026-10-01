import type {
  Machine,
  MonitoringPoint,
  ReadingBucket,
  ReadingsAnswer,
  SeriesMetrics,
  TimeSeriesSummary,
} from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

const T0 = Date.parse('2026-09-29T10:00:00Z');
const at = (minutes: number) => new Date(T0 + minutes * 60_000).toISOString();

/** Retrieval, metrics and deletion of time-series (C1, C6, C7; challenge, section 7). */
describe('time-series over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let point: MonitoringPoint;

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
    [point] = (
      await readJson<{ items: MonitoringPoint[] }>(
        await operator('POST', `/machines/${fan.id}/monitoring-points`, {
          positions: [{ location: 'FAN_MOTOR_DE' }],
        }),
      )
    ).items;
    await operator('PUT', `/monitoring-points/${point.id}/sensor`, {
      serialNumber: 'DX-0001',
      model: 'TcAs',
    });
  });

  afterAll(async () => {
    await http.app.close();
  });

  async function send(
    readings: { quantity?: string; axis?: string | null; minute: number; value: number }[],
  ) {
    const response = await operator('POST', '/readings', {
      readings: readings.map(({ quantity = 'velocity_rms', axis = 'H', minute, value }) => ({
        serialNumber: 'DX-0001',
        timestamp: at(minute),
        quantity,
        axis,
        value,
      })),
    });
    expect(response.status).toBe(200);
  }

  async function seriesOf(pointId = point.id, client = operator) {
    return client('GET', `/monitoring-points/${pointId}/time-series`);
  }

  async function velocityId() {
    const list = await readJson<TimeSeriesSummary[]>(await seriesOf());
    return list.find((series) => series.quantity === 'velocity_rms' && series.axis === 'H')!.id;
  }

  describe('series of a point', () => {
    it('lists them by quantity, then axis, with unit, label, count and first and last instants', async () => {
      await send([
        { quantity: 'temperature', axis: null, minute: 0, value: 48 },
        { axis: 'A', minute: 0, value: 1 },
        { axis: 'H', minute: 0, value: 2 },
        { axis: 'H', minute: 10, value: 3 },
        { quantity: 'acceleration_rms', axis: 'V', minute: 0, value: 0.5 },
      ]);

      const list = await readJson<TimeSeriesSummary[]>(await seriesOf());

      expect(list.map((series) => [series.label, series.unit, series.readingCount])).toEqual([
        ['Acceleration RMS, vertical', 'g', 1],
        ['Velocity RMS, horizontal', 'mm/s', 2],
        ['Velocity RMS, axial', 'mm/s', 1],
        ['Temperature', '°C', 1],
      ]);
      expect(list[1]).toMatchObject({
        monitoringPointId: point.id,
        quantity: 'velocity_rms',
        axis: 'H',
        firstTimestamp: at(0),
        lastTimestamp: at(10),
      });
    });

    it('answers an empty list for a point without series, and 404 for another user', async () => {
      expect(await readJson<unknown[]>(await seriesOf())).toEqual([]);
      expect((await seriesOf(point.id, other)).status).toBe(404);
    });
  });

  describe('metrics', () => {
    beforeEach(async () => {
      await send([1, 2, 3, 4].map((value, index) => ({ minute: index * 10, value })));
    });

    it('computes count, min, max, mean, population deviation and RMS in the database (C6)', async () => {
      const id = await velocityId();

      const metrics = await readJson<SeriesMetrics>(
        await operator('GET', `/time-series/${id}/metrics`),
      );

      expect(metrics).toMatchObject({
        count: 4,
        min: 1,
        max: 4,
        mean: 2.5,
        firstTimestamp: at(0),
        lastTimestamp: at(30),
      });
      expect(metrics.stdDev).toBeCloseTo(Math.sqrt(1.25), 12);
      expect(metrics.rms).toBeCloseTo(Math.sqrt(7.5), 12);
    });

    it('limits them to an interval, both ends included', async () => {
      const id = await velocityId();
      const query = new URLSearchParams({ from: at(10), to: at(20) });

      const metrics = await readJson<SeriesMetrics>(
        await operator('GET', `/time-series/${id}/metrics?${query}`),
      );

      expect(metrics).toMatchObject({ count: 2, min: 2, max: 3, mean: 2.5 });
    });

    it('answers a single reading with a deviation of zero, which was measured', async () => {
      const id = await velocityId();
      const query = new URLSearchParams({ from: at(0), to: at(0) });

      const metrics = await readJson<SeriesMetrics>(
        await operator('GET', `/time-series/${id}/metrics?${query}`),
      );

      expect(metrics).toMatchObject({ count: 1, min: 1, stdDev: 0, rms: 1 });
    });

    it('answers an interval without readings with a count of zero and nulls, never zeros (C7)', async () => {
      const id = await velocityId();
      const query = new URLSearchParams({ from: at(100) });

      const metrics = await readJson<SeriesMetrics>(
        await operator('GET', `/time-series/${id}/metrics?${query}`),
      );

      expect(metrics).toEqual({
        count: 0,
        min: null,
        max: null,
        mean: null,
        stdDev: null,
        rms: null,
        firstTimestamp: null,
        lastTimestamp: null,
      });
    });

    it('refuses an interval that ends before it starts, and 404s another user', async () => {
      const id = await velocityId();
      const query = new URLSearchParams({ from: at(20), to: at(10) });

      const refused = await operator('GET', `/time-series/${id}/metrics?${query}`);

      expect(refused.status).toBe(422);
      expect((await readJson<{ errors: unknown[] }>(refused)).errors).toEqual([
        { field: 'to', message: 'Must not be before from.' },
      ]);
      expect((await other('GET', `/time-series/${id}/metrics`)).status).toBe(404);
      expect((await operator('GET', '/time-series/not-a-uuid/metrics')).status).toBe(404);
    });
  });

  describe('readings', () => {
    it('answers the full series in time order, as the challenge asks', async () => {
      await send([
        { minute: 20, value: 3 },
        { minute: 0, value: 1 },
        { minute: 10, value: 2 },
      ]);
      const id = await velocityId();

      const answer = await readJson<ReadingsAnswer>(
        await operator('GET', `/time-series/${id}/readings`),
      );

      expect(answer).toEqual({
        downsampled: false,
        readings: [
          { timestamp: at(0), value: 1 },
          { timestamp: at(10), value: 2 },
          { timestamp: at(20), value: 3 },
        ],
      });
    });

    it('answers every reading when they fit in maxPoints', async () => {
      await send([0, 1, 2, 3].map((minute) => ({ minute, value: minute })));
      const id = await velocityId();

      const answer = await readJson<ReadingsAnswer>(
        await operator('GET', `/time-series/${id}/readings?maxPoints=4`),
      );

      expect(answer.downsampled).toBe(false);
    });

    describe('above maxPoints', () => {
      let buckets: ReadingBucket[];

      beforeEach(async () => {
        // 100 readings, one per minute, value = minute, and one spike of 50 at minute 37.
        await send(
          Array.from({ length: 100 }, (_, minute) => ({
            minute,
            value: minute === 37 ? 50 : minute,
          })),
        );
        const id = await velocityId();
        const answer = await readJson<ReadingsAnswer>(
          await operator('GET', `/time-series/${id}/readings?maxPoints=10`),
        );
        expect(answer.downsampled).toBe(true);
        buckets = answer.downsampled ? answer.buckets : [];
      });

      it('splits the interval into maxPoints / 2 buckets that cover every reading', () => {
        expect(buckets).toHaveLength(5);
        expect(buckets[0].start).toBe(at(0));
        expect(buckets[4].end).toBe(at(99));
        expect(buckets.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(100);
      });

      it('keeps the peak that an average would hide', () => {
        // Minutes 19.8 to 39.6 average about 30; the spike of 50 at minute 37 is the maximum.
        expect(buckets[1]).toMatchObject({ min: 20, max: 50, count: 20 });
        expect(buckets[0].min).toBe(0);
        expect(buckets[4].max).toBe(99);
      });
    });

    it('leaves out empty buckets, so a gap in the data stays a gap', async () => {
      await send([
        ...[0, 1, 2].map((minute) => ({ minute, value: 1 })),
        ...[97, 98, 99].map((minute) => ({ minute, value: 2 })),
      ]);
      const id = await velocityId();

      const answer = await readJson<ReadingsAnswer>(
        await operator('GET', `/time-series/${id}/readings?maxPoints=4`),
      );

      expect(answer.downsampled && answer.buckets.map((bucket) => bucket.count)).toEqual([3, 3]);
    });

    it('buckets over the requested interval, not only where data exists', async () => {
      await send(Array.from({ length: 10 }, (_, minute) => ({ minute, value: minute })));
      const id = await velocityId();
      const query = new URLSearchParams({ from: at(0), to: at(100), maxPoints: '4' });

      const answer = await readJson<ReadingsAnswer>(
        await operator('GET', `/time-series/${id}/readings?${query}`),
      );

      expect(answer.downsampled && answer.buckets).toEqual([
        { start: at(0), end: at(50), min: 0, max: 9, count: 10 },
      ]);
    });

    it('refuses maxPoints outside 2 to 5,000', async () => {
      await send([{ minute: 0, value: 1 }]);
      const id = await velocityId();

      expect((await operator('GET', `/time-series/${id}/readings?maxPoints=1`)).status).toBe(422);
    });
  });

  describe('deletion', () => {
    it('removes the series and its readings only, then answers 404', async () => {
      await send([
        { minute: 0, value: 1 },
        { quantity: 'temperature', axis: null, minute: 0, value: 48 },
      ]);
      const id = await velocityId();

      expect((await other('DELETE', `/time-series/${id}`)).status).toBe(404);
      expect((await operator('DELETE', `/time-series/${id}`)).status).toBe(204);
      expect((await operator('DELETE', `/time-series/${id}`)).status).toBe(404);

      const left = await readJson<TimeSeriesSummary[]>(await seriesOf());
      expect(left.map((series) => series.label)).toEqual(['Temperature']);
      expect(await http.prisma.reading.count()).toBe(1);
    });

    it('lets a later reading create the series again', async () => {
      await send([{ minute: 0, value: 1 }]);
      await operator('DELETE', `/time-series/${await velocityId()}`);

      await send([{ minute: 0, value: 1 }]);

      expect(await readJson<unknown[]>(await seriesOf())).toHaveLength(1);
    });
  });
});

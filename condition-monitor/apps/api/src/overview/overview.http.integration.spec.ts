import type { Machine, MonitoringPoint, Overview } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

/** The counts of the overview screen, including the number of time-series (E1). */
describe('overview over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    other = (await http.loginAs('other@plant.test')).request;
  });

  afterAll(async () => {
    await http.app.close();
  });

  /** A sector with one fan, two points, one sensor and its readings. */
  async function plant(client: HttpClient, code: string, serialNumber: string) {
    const sector = await readJson<{ id: string }>(
      await client('POST', '/sectors', { code, name: code }),
    );
    const fan = await readJson<Machine>(
      await client('POST', '/machines', {
        sectorId: sector.id,
        type: 'Fan',
        number: 1,
        name: 'Fan',
      }),
    );
    const [point] = (
      await readJson<{ items: MonitoringPoint[] }>(
        await client('POST', `/machines/${fan.id}/monitoring-points`, {
          positions: [{ location: 'FAN_MOTOR_DE' }, { location: 'FAN_SHAFT_DE' }],
        }),
      )
    ).items;
    await client('PUT', `/monitoring-points/${point.id}/sensor`, { serialNumber, model: 'TcAs' });
    await client('POST', '/readings', {
      readings: [
        {
          serialNumber,
          timestamp: '2026-09-29T10:00:00Z',
          quantity: 'velocity_rms',
          axis: 'H',
          value: 1,
        },
        {
          serialNumber,
          timestamp: '2026-09-29T10:10:00Z',
          quantity: 'velocity_rms',
          axis: 'H',
          value: 2,
        },
        {
          serialNumber,
          timestamp: '2026-09-29T10:00:00Z',
          quantity: 'temperature',
          axis: null,
          value: 40,
        },
      ],
    });
  }

  it('counts zero of everything for a new user', async () => {
    expect(await readJson<Overview>(await operator('GET', '/overview'))).toEqual({
      sectors: 0,
      machines: 0,
      monitoringPoints: 0,
      sensors: 0,
      timeSeries: 0,
      readings: 0,
    });
  });

  it('counts only what the user owns', async () => {
    await plant(operator, 'DRY', 'DX-0001');
    await plant(other, 'WET', 'DX-0002');
    await plant(other, 'PRS', 'DX-0003');

    expect(await readJson<Overview>(await operator('GET', '/overview'))).toEqual({
      sectors: 1,
      machines: 1,
      monitoringPoints: 2,
      sensors: 1,
      timeSeries: 2,
      readings: 3,
    });
  });

  it('requires a session', async () => {
    expect((await http.anonymous('GET', '/overview')).status).toBe(401);
  });
});

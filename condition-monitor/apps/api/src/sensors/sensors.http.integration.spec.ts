import type { Machine, MachineDetail, MonitoringPoint } from '@condition-monitor/shared';
import { violatedCheck } from '../common/database/prisma-errors';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  title: string;
  detail: string;
  errors: Record<string, unknown>[];
}

/** Sensor routes and the machine type change over HTTP (assumptions B4, B5, B14, B15). */
describe('sensors over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let pump: Machine;
  let fan: Machine;
  let pumpPoint: MonitoringPoint;
  let fanPoints: MonitoringPoint[];

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
    const machine = async (type: string) =>
      readJson<Machine>(
        await operator('POST', '/machines', { sectorId: sector.id, type, number: 1, name: type }),
      );
    pump = await machine('Pump');
    fan = await machine('Fan');
    const add = async (target: Machine, positions: unknown[]) =>
      (
        await readJson<{ items: MonitoringPoint[] }>(
          await operator('POST', `/machines/${target.id}/monitoring-points`, { positions }),
        )
      ).items;
    [pumpPoint] = await add(pump, [{ location: 'PUMP_MOTOR_DE' }]);
    fanPoints = await add(fan, [
      { location: 'FAN_MOTOR_DE' },
      { location: 'OTHER', name: 'Casing' },
    ]);
  });

  afterAll(async () => {
    await http.app.close();
  });

  async function install(
    point: MonitoringPoint,
    serialNumber: string,
    model: string,
    client = operator,
  ) {
    const response = await client('PUT', `/monitoring-points/${point.id}/sensor`, {
      serialNumber,
      model,
    });
    return { status: response.status, body: await readJson<MonitoringPoint & ErrorBody>(response) };
  }

  it('installs HF+ on a pump, normalizing the serial number', async () => {
    const { status, body } = await install(pumpPoint, ' dx-0001 ', 'HF+');

    expect(status).toBe(200);
    expect(body.sensor).toEqual({ serialNumber: 'DX-0001', model: 'HF+' });
  });

  it('refuses TcAg and TcAs on a pump with 422 on the model field (B15)', async () => {
    for (const model of ['TcAg', 'TcAs']) {
      const { status, body } = await install(pumpPoint, 'DX-0002', model);

      expect(status).toBe(422);
      expect(body.errors).toEqual([
        { field: 'model', message: `${model} is not allowed on a Pump. Accepted: HF+.` },
      ]);
    }
    expect(await http.prisma.sensor.count()).toBe(0);
  });

  it('accepts every model on a fan', async () => {
    expect((await install(fanPoints[0], 'DX-0003', 'TcAg')).status).toBe(200);
    expect((await install(fanPoints[1], 'DX-0004', 'TcAs')).status).toBe(200);
  });

  it('replaces the sensor of a point in place, keeping the point (B14)', async () => {
    await install(fanPoints[0], 'DX-0005', 'TcAg');

    const { body } = await install(fanPoints[0], 'DX-0006', 'HF+');

    expect(body).toMatchObject({
      id: fanPoints[0].id,
      sensor: { serialNumber: 'DX-0006', model: 'HF+' },
    });
    expect(await http.prisma.sensor.count()).toBe(1);
  });

  it('refuses a serial installed at another point, saying where when it is the user own', async () => {
    await install(fanPoints[0], 'DX-0007', 'TcAg');

    const { status, body } = await install(fanPoints[1], 'DX-0007', 'TcAg');

    expect(status).toBe(409);
    expect(body.errors).toEqual([
      {
        field: 'serialNumber',
        message:
          'DX-0007 is installed at DRY-FAN-01, Motor, drive end bearing. Remove it there first.',
      },
    ]);
  });

  it("does not reveal where another user's sensor is", async () => {
    const sector = await readJson<{ id: string }>(
      await other('POST', '/sectors', { code: 'WET', name: 'Wet end' }),
    );
    const theirMachine = await readJson<Machine>(
      await other('POST', '/machines', { sectorId: sector.id, type: 'Fan', number: 1, name: 'F' }),
    );
    const [theirPoint] = (
      await readJson<{ items: MonitoringPoint[] }>(
        await other('POST', `/machines/${theirMachine.id}/monitoring-points`, {
          positions: [{ location: 'OTHER' }],
        }),
      )
    ).items;
    await install(theirPoint, 'DX-0008', 'TcAg', other);

    const { status, body } = await install(fanPoints[0], 'DX-0008', 'TcAg');

    expect(status).toBe(409);
    expect(body.detail).toBe('Sensor DX-0008 is installed elsewhere.');
  });

  it('removes a sensor and keeps the point; removing again answers 404', async () => {
    await install(fanPoints[0], 'DX-0009', 'TcAg');

    const removed = await operator('DELETE', `/monitoring-points/${fanPoints[0].id}/sensor`);
    const again = await operator('DELETE', `/monitoring-points/${fanPoints[0].id}/sensor`);

    expect([removed.status, again.status]).toEqual([204, 404]);
    expect(await http.prisma.monitoringPoint.count({ where: { id: fanPoints[0].id } })).toBe(1);
  });

  it("answers 404 for another user's point", async () => {
    expect((await install(fanPoints[0], 'DX-0010', 'TcAg', other)).status).toBe(404);
  });

  describe('changing the machine type (B5)', () => {
    it('lists every point that would become invalid, and changes nothing', async () => {
      await install(fanPoints[0], 'DX-0011', 'TcAg');
      await install(fanPoints[1], 'DX-0012', 'TcAs');

      const response = await operator('PATCH', `/machines/${fan.id}`, { type: 'Pump', number: 2 });

      expect(response.status).toBe(409);
      expect(await readJson<ErrorBody>(response)).toEqual({
        type: 'urn:condition-monitor:error:conflict',
        title: 'Machine type cannot change',
        status: 409,
        detail: '2 monitoring points are not valid for Pump.',
        errors: [
          {
            monitoringPointId: fanPoints[0].id,
            name: 'Motor, drive end bearing',
            reason: 'Position FAN_MOTOR_DE belongs to Fan.',
          },
          {
            monitoringPointId: fanPoints[0].id,
            name: 'Motor, drive end bearing',
            reason: 'Sensor model TcAg is not allowed on Pump.',
          },
          {
            monitoringPointId: fanPoints[1].id,
            name: 'Casing',
            reason: 'Sensor model TcAs is not allowed on Pump.',
          },
        ],
      });
      const detail = await readJson<MachineDetail>(await operator('GET', `/machines/${fan.id}`));
      expect(detail.type).toBe('Fan');
    });

    it('allows the change once the points are valid, carrying the type to them', async () => {
      await operator('DELETE', `/monitoring-points/${fanPoints[0].id}`);
      await install(fanPoints[1], 'DX-0013', 'HF+');

      const response = await operator('PATCH', `/machines/${fan.id}`, { type: 'Pump', number: 2 });

      expect(response.status).toBe(200);
      const [point] = await http.prisma.sensor.findMany();
      expect(point.machineType).toBe('PUMP');
    });
  });

  it('recognizes the CHECK a write violated, from a real database refusal', async () => {
    await install(fanPoints[1], 'DX-0014', 'TcAg');

    const error = await http.prisma.machine
      .update({ where: { id: fan.id }, data: { type: 'PUMP', number: 2 } })
      .catch((caught: unknown) => caught);

    expect(violatedCheck(error)).toBe('monitoring_points_location_type_check');
  });
});

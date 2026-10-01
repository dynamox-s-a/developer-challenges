import type { Machine, MonitoringPoint, SensorInstallation } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

/** The installed sensors, as the simulator discovers them (C13). */
describe('sensor list over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let fanPoints: MonitoringPoint[];
  let pumpPoint: MonitoringPoint;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    other = (await http.loginAs('other@plant.test')).request;
    const machine = async (client: HttpClient, code: string, type: string, number: number) => {
      const sector = await readJson<{ id: string }>(
        await client('POST', '/sectors', { code, name: code }),
      );
      return readJson<Machine>(
        await client('POST', '/machines', { sectorId: sector.id, type, number, name: type }),
      );
    };
    const points = async (client: HttpClient, target: Machine, locations: string[]) =>
      (
        await readJson<{ items: MonitoringPoint[] }>(
          await client('POST', `/machines/${target.id}/monitoring-points`, {
            positions: locations.map((location) => ({ location })),
          }),
        )
      ).items;
    const install = (
      client: HttpClient,
      point: MonitoringPoint,
      serialNumber: string,
      model: string,
    ) => client('PUT', `/monitoring-points/${point.id}/sensor`, { serialNumber, model });

    const fan = await machine(operator, 'DRY', 'Fan', 1);
    fanPoints = await points(operator, fan, ['FAN_MOTOR_DE', 'FAN_SHAFT_DE', 'OTHER']);
    await install(operator, fanPoints[1], 'DX-0003', 'TcAs');
    await install(operator, fanPoints[0], 'DX-0001', 'TcAg');
    // fanPoints[2] stays without a sensor.

    const otherPump = await machine(other, 'WET', 'Pump', 1);
    [pumpPoint] = await points(other, otherPump, ['PUMP_MOTOR_DE']);
    await install(other, pumpPoint, 'DX-0002', 'HF+');
  });

  afterAll(async () => {
    await http.app.close();
  });

  const list = async (query = '', client = operator) =>
    readJson<SensorInstallation[]>(await client('GET', `/sensors${query}`));

  it('lists the installed sensors of the user by serial number, with their place', async () => {
    expect(await list()).toEqual([
      {
        serialNumber: 'DX-0001',
        model: 'TcAg',
        monitoringPointId: fanPoints[0].id,
        location: 'FAN_MOTOR_DE',
        machineTag: 'DRY-FAN-01',
        machineType: 'Fan',
      },
      {
        serialNumber: 'DX-0003',
        model: 'TcAs',
        monitoringPointId: fanPoints[1].id,
        location: 'FAN_SHAFT_DE',
        machineTag: 'DRY-FAN-01',
        machineType: 'Fan',
      },
    ]);
    expect((await list('', other)).map((sensor) => sensor.serialNumber)).toEqual(['DX-0002']);
  });

  it('narrows to one or several serial numbers, normalized like everywhere else (B4)', async () => {
    expect((await list('?serialNumber=dx-0003')).map((sensor) => sensor.serialNumber)).toEqual([
      'DX-0003',
    ]);
    expect(
      (await list('?serialNumber=DX-0003&serialNumber=DX-0001')).map(
        (sensor) => sensor.serialNumber,
      ),
    ).toEqual(['DX-0001', 'DX-0003']);
  });

  it('leaves out a serial number that is unknown, removed or of another user (A4)', async () => {
    await operator('DELETE', `/monitoring-points/${fanPoints[1].id}/sensor`);

    const found = await list(
      '?serialNumber=DX-0001&serialNumber=DX-0002&serialNumber=DX-0003&serialNumber=DX-9999',
    );

    expect(found.map((sensor) => sensor.serialNumber)).toEqual(['DX-0001']);
  });

  it('refuses a malformed serial number, naming the field', async () => {
    const response = await operator('GET', '/sensors?serialNumber=DX%200001');

    expect(response.status).toBe(422);
    expect((await readJson<{ errors: { field: string }[] }>(response)).errors[0].field).toBe(
      'serialNumber.0',
    );
  });

  it('requires a session', async () => {
    expect((await http.anonymous('GET', '/sensors')).status).toBe(401);
  });
});

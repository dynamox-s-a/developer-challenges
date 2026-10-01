import type { Machine, MachineDetail, MonitoringPoint, Page } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  detail: string;
  errors: { field: string; message: string }[];
}

/** Monitoring point routes over HTTP (API contract, "Monitoring points"). */
describe('monitoring points over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let pump: Machine;
  let fan: Machine;

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
    pump = await readJson<Machine>(
      await operator('POST', '/machines', {
        sectorId: sector.id,
        type: 'Pump',
        number: 1,
        name: 'Condensate pump',
      }),
    );
    fan = await readJson<Machine>(
      await operator('POST', '/machines', {
        sectorId: sector.id,
        type: 'Fan',
        number: 1,
        name: 'Hood exhaust fan',
      }),
    );
  });

  afterAll(async () => {
    await http.app.close();
  });

  async function addPositions(machine: Machine, positions: unknown[], client = operator) {
    const response = await client('POST', `/machines/${machine.id}/monitoring-points`, {
      positions,
    });
    return {
      status: response.status,
      body: await readJson<{ items: MonitoringPoint[] } & ErrorBody>(response),
    };
  }

  /** Sensor routes arrive in the next step; the tests install sensors directly. */
  async function installSensor(pointId: string, machineType: 'PUMP' | 'FAN', model: string) {
    await http.prisma.sensor.create({
      data: {
        monitoringPointId: pointId,
        machineType,
        serialNumber: `DX-${pointId.slice(0, 8).toUpperCase()}`,
        model: model as 'HF_PLUS' | 'TC_AG' | 'TC_AS',
      },
    });
  }

  it('adds the selected positions, naming them after their label unless named', async () => {
    const { status, body } = await addPositions(pump, [
      { location: 'PUMP_MOTOR_DE' },
      { location: 'OTHER', name: 'Base plate' },
    ]);

    expect(status).toBe(201);
    expect(body.items.map((point) => [point.location, point.name])).toEqual([
      ['PUMP_MOTOR_DE', 'Motor, drive end bearing'],
      ['OTHER', 'Base plate'],
    ]);
    expect(body.items[0]).toMatchObject({
      machine: { id: pump.id, tag: 'DRY-PUMP-01', name: 'Condensate pump', type: 'Pump' },
      sensor: null,
    });
  });

  it('refuses a position of the other type with 422 naming it, adding none', async () => {
    const { status, body } = await addPositions(pump, [
      { location: 'PUMP_MOTOR_DE' },
      { location: 'FAN_SHAFT_DE' },
    ]);

    expect(status).toBe(422);
    expect(body.errors).toEqual([
      { field: 'positions.1.location', message: 'FAN_SHAFT_DE is not a position of a Pump.' },
    ]);
    expect(await http.prisma.monitoringPoint.count()).toBe(0);
  });

  it('refuses a position the machine already has with 409 naming it', async () => {
    await addPositions(fan, [{ location: 'FAN_MOTOR_DE' }]);

    const { status, body } = await addPositions(fan, [
      { location: 'FAN_SHAFT_DE' },
      { location: 'FAN_MOTOR_DE' },
    ]);

    expect(status).toBe(409);
    expect(body.errors).toEqual([
      {
        field: 'positions.1.location',
        message: 'This position already has a point on the machine.',
      },
    ]);
    expect(await http.prisma.monitoringPoint.count()).toBe(1);
  });

  it("answers 404 for another user's machine", async () => {
    expect((await addPositions(pump, [{ location: 'OTHER' }], other)).status).toBe(404);
  });

  describe('the challenge list', () => {
    async function list(query = '') {
      return readJson<Page<MonitoringPoint>>(await operator('GET', `/monitoring-points${query}`));
    }

    function rows(page: Page<MonitoringPoint>) {
      return page.items.map((point) => [
        point.machine.name,
        point.machine.type,
        point.name,
        point.sensor?.model ?? null,
      ]);
    }

    beforeEach(async () => {
      const pumpPoints = (
        await addPositions(pump, [
          { location: 'PUMP_MOTOR_DE', name: 'Alpha' },
          { location: 'PUMP_IMPELLER_SIDE', name: 'Delta' },
        ])
      ).body.items;
      const fanPoints = (
        await addPositions(fan, [
          { location: 'FAN_MOTOR_DE', name: 'Bravo' },
          { location: 'FAN_SHAFT_DE', name: 'Charlie' },
        ])
      ).body.items;
      await installSensor(pumpPoints[0].id, 'PUMP', 'HF_PLUS');
      await installSensor(fanPoints[0].id, 'FAN', 'TC_AG');
      await installSensor(fanPoints[1].id, 'FAN', 'TC_AS');
    });

    it('shows 5 per page with the four required columns, by machine name', async () => {
      const page = await list();

      expect(page).toMatchObject({ total: 4, page: 1, pageSize: 5 });
      expect(rows(page)).toEqual([
        ['Condensate pump', 'Pump', 'Alpha', 'HF+'],
        ['Condensate pump', 'Pump', 'Delta', null],
        ['Hood exhaust fan', 'Fan', 'Bravo', 'TcAg'],
        ['Hood exhaust fan', 'Fan', 'Charlie', 'TcAs'],
      ]);
    });

    it('sorts by each required column in both directions', async () => {
      const names = async (query: string) => rows(await list(query)).map((row) => row[2]);

      expect(await names('?sort=machineName&order=desc')).toEqual([
        'Bravo',
        'Charlie',
        'Alpha',
        'Delta',
      ]);
      expect(await names('?sort=machineType')).toEqual(['Bravo', 'Charlie', 'Alpha', 'Delta']);
      expect(await names('?sort=machineType&order=desc')).toEqual([
        'Alpha',
        'Delta',
        'Bravo',
        'Charlie',
      ]);
      expect(await names('?sort=monitoringPointName')).toEqual([
        'Alpha',
        'Bravo',
        'Charlie',
        'Delta',
      ]);
      expect(await names('?sort=monitoringPointName&order=desc')).toEqual([
        'Delta',
        'Charlie',
        'Bravo',
        'Alpha',
      ]);
    });

    it('sorts by sensor model with the point without a sensor last in both directions (B7)', async () => {
      const models = async (query: string) => rows(await list(query)).map((row) => row[3]);

      expect(await models('?sort=sensorModel')).toEqual(['HF+', 'TcAg', 'TcAs', null]);
      expect(await models('?sort=sensorModel&order=desc')).toEqual(['TcAs', 'TcAg', 'HF+', null]);
    });

    it('pages with a stable order, without skipping or repeating a point', async () => {
      const first = await list('?pageSize=3&sort=machineType');
      const second = await list('?pageSize=3&sort=machineType&page=2');

      const ids = [...first.items, ...second.items].map((point) => point.id);
      expect(first.total).toBe(4);
      expect(new Set(ids).size).toBe(4);
      expect(second.items).toHaveLength(1);
    });

    it("never lists another user's points", async () => {
      const theirs = await readJson<Page<MonitoringPoint>>(
        await other('GET', '/monitoring-points'),
      );

      expect(theirs.total).toBe(0);
    });
  });

  it('renames a point and moves it to a free position of its type', async () => {
    const [point] = (await addPositions(fan, [{ location: 'FAN_MOTOR_DE' }])).body.items;

    const moved = await operator('PATCH', `/monitoring-points/${point.id}`, {
      location: 'FAN_SHAFT_NDE',
      name: 'Fan shaft, free end',
    });
    const wrongType = await operator('PATCH', `/monitoring-points/${point.id}`, {
      location: 'PUMP_MOTOR_DE',
    });

    expect(moved.status).toBe(200);
    expect(await readJson<MonitoringPoint>(moved)).toMatchObject({
      location: 'FAN_SHAFT_NDE',
      name: 'Fan shaft, free end',
    });
    expect(wrongType.status).toBe(422);
  });

  it('answers 409 when moving a point to a position already taken', async () => {
    const points = (
      await addPositions(fan, [{ location: 'FAN_MOTOR_DE' }, { location: 'FAN_SHAFT_DE' }])
    ).body.items;

    const response = await operator('PATCH', `/monitoring-points/${points[1].id}`, {
      location: 'FAN_MOTOR_DE',
    });

    expect(response.status).toBe(409);
  });

  it('deletes a point with its sensor, and not one of another user', async () => {
    const [point] = (await addPositions(fan, [{ location: 'FAN_MOTOR_DE' }])).body.items;
    await installSensor(point.id, 'FAN', 'TC_AG');

    expect((await other('DELETE', `/monitoring-points/${point.id}`)).status).toBe(404);
    expect((await operator('DELETE', `/monitoring-points/${point.id}`)).status).toBe(204);
    expect(await http.prisma.sensor.count()).toBe(0);
  });

  it('answers the machine with its points in power-flow order and what deleting removes', async () => {
    const points = (
      await addPositions(pump, [
        { location: 'OTHER', name: 'Base plate' },
        { location: 'PUMP_IMPELLER_SIDE' },
        { location: 'PUMP_MOTOR_NDE' },
      ])
    ).body.items;
    await installSensor(points[0].id, 'PUMP', 'HF_PLUS');

    const detail = await readJson<MachineDetail>(await operator('GET', `/machines/${pump.id}`));

    expect(detail.tag).toBe('DRY-PUMP-01');
    expect(detail.monitoringPoints.map((point) => point.location)).toEqual([
      'PUMP_MOTOR_NDE',
      'PUMP_IMPELLER_SIDE',
      'OTHER',
    ]);
    expect(detail.counts).toEqual({ monitoringPoints: 3, sensors: 1 });
  });
});

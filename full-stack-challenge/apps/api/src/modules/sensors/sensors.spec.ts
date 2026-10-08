import request from 'supertest';
import { authCookie, resetDatabase, UNKNOWN_ID } from '../../../tests/helpers';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

const app = createApp();
const cookie = authCookie();

function attach(pointId: string, body: object) {
  return request(app)
    .post(`/api/v1/monitoring-points/${pointId}/sensor`)
    .set('Cookie', cookie)
    .send(body);
}

function remove(sensorId: string) {
  return request(app)
    .delete(`/api/v1/sensors/${sensorId}`)
    .set('Cookie', cookie);
}

async function pointOn(type: 'Pump' | 'Fan') {
  const machine = await prisma.machine.create({
    data: {
      name: `${type} 01`,
      type,
      monitoringPoints: { create: { name: 'Mancal' } },
    },
    include: { monitoringPoints: true },
  });
  return { machine, point: machine.monitoringPoints[0] };
}

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

describe('sensor routes', () => {
  it.each([
    ['POST', `/api/v1/monitoring-points/${UNKNOWN_ID}/sensor`],
    ['DELETE', `/api/v1/sensors/${UNKNOWN_ID}`],
  ])('%s %s requires a session', async (method, path) => {
    const res =
      await request(app)[method.toLowerCase() as 'post' | 'delete'](path);

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/monitoring-points/:pointId/sensor', () => {
  describe('machine × sensor rule', () => {
    it.each([
      ['Pump', 'TcAg', 422],
      ['Pump', 'TcAs', 422],
      ['Pump', 'HF+', 201],
      ['Fan', 'TcAg', 201],
      ['Fan', 'TcAs', 201],
      ['Fan', 'HF+', 201],
    ] as const)('%s + %s -> %i', async (machineType, model, status) => {
      const { point } = await pointOn(machineType);

      const res = await attach(point.id, { serialNumber: 'SN-001', model });

      expect(res.status).toBe(status);
      if (status === 422) {
        expect(res.body.error).toEqual({
          code: 'BUSINESS_RULE_VIOLATION',
          message: `${model} sensors cannot be used on Pump machines`,
          details: { machineType, sensorModel: model },
        });
        expect(await prisma.sensor.count()).toBe(0);
      } else {
        expect(res.body).toEqual({
          id: expect.any(String),
          serialNumber: 'SN-001',
          model,
          monitoringPointId: point.id,
          createdAt: expect.any(String),
        });
      }
    });
  });

  it('stores HF+ as HFPlus in the database', async () => {
    const { point } = await pointOn('Fan');

    await attach(point.id, { serialNumber: 'SN-001', model: 'HF+' });

    expect((await prisma.sensor.findFirstOrThrow()).model).toBe('HFPlus');
  });

  it('rejects a serial number already used by another sensor with 409', async () => {
    const first = await pointOn('Fan');
    const second = await pointOn('Fan');
    await attach(first.point.id, { serialNumber: 'SN-001', model: 'TcAg' });

    const res = await attach(second.point.id, {
      serialNumber: 'SN-001',
      model: 'TcAs',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toEqual({
      code: 'CONFLICT',
      message: 'Serial number already in use',
      details: { fields: ['serialNumber'] },
    });
  });

  it('rejects a second sensor on the same point with 409', async () => {
    const { point } = await pointOn('Fan');
    await attach(point.id, { serialNumber: 'SN-001', model: 'TcAg' });

    const res = await attach(point.id, {
      serialNumber: 'SN-002',
      model: 'TcAs',
    });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe(
      'Monitoring point already has a sensor',
    );
    expect(await prisma.sensor.count()).toBe(1);
  });

  it('returns 404 for an unknown point', async () => {
    const res = await attach(UNKNOWN_ID, {
      serialNumber: 'SN-001',
      model: 'TcAg',
    });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Monitoring point not found');
  });

  it.each([
    [
      'the database key instead of the API value',
      { serialNumber: 'SN-1', model: 'HFPlus' },
    ],
    ['an unknown model', { serialNumber: 'SN-1', model: 'XYZ' }],
    ['an empty serial number', { serialNumber: ' ', model: 'TcAg' }],
    [
      'a serial number with spaces inside',
      { serialNumber: 'SN 1', model: 'TcAg' },
    ],
    ['a missing model', { serialNumber: 'SN-1' }],
  ])('rejects %s with 400', async (_, body) => {
    const { point } = await pointOn('Fan');

    const res = await attach(point.id, body);

    expect(res.status).toBe(400);
  });

  it('never lets a concurrent type change and attach break the rule', async () => {
    // Without the machine lock, both can pass their checks under READ COMMITTED.
    for (let round = 0; round < 10; round++) {
      await resetDatabase();
      const { machine, point } = await pointOn('Fan');

      const [update, attached] = await Promise.all([
        request(app)
          .put(`/api/v1/machines/${machine.id}`)
          .set('Cookie', cookie)
          .send({ name: machine.name, type: 'Pump' }),
        attach(point.id, { serialNumber: `SN-${round}`, model: 'TcAg' }),
      ]);

      expect([update.status, attached.status].sort()).toEqual(
        update.status === 200 ? [200, 422] : [201, 422],
      );
      const stored = await prisma.machine.findUniqueOrThrow({
        where: { id: machine.id },
        include: { monitoringPoints: { include: { sensor: true } } },
      });
      const hasTcAg = stored.monitoringPoints.some(
        (p) => p.sensor?.model === 'TcAg',
      );
      expect(stored.type === 'Pump' && hasTcAg).toBe(false);
    }
  });
});

describe('DELETE /api/v1/sensors/:id', () => {
  it('removes the sensor and its readings, keeping the point', async () => {
    const { point } = await pointOn('Fan');
    const sensor = (
      await attach(point.id, { serialNumber: 'SN-001', model: 'TcAg' })
    ).body;
    await prisma.reading.createMany({
      data: [1, 2, 3].map((value) => ({
        sensorId: sensor.id,
        timestamp: new Date(Date.UTC(2026, 0, value)),
        value,
      })),
    });

    const res = await remove(sensor.id);

    expect(res.status).toBe(204);
    expect(await prisma.sensor.count()).toBe(0);
    expect(await prisma.reading.count()).toBe(0);
    expect(
      await prisma.monitoringPoint.count({ where: { id: point.id } }),
    ).toBe(1);
  });

  it('frees the serial number and the point for a new sensor', async () => {
    const { point } = await pointOn('Fan');
    const sensor = (
      await attach(point.id, { serialNumber: 'SN-001', model: 'TcAg' })
    ).body;
    await remove(sensor.id);

    const res = await attach(point.id, {
      serialNumber: 'SN-001',
      model: 'HF+',
    });

    expect(res.status).toBe(201);
  });

  it('returns 404 for an unknown sensor', async () => {
    const res = await remove(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Sensor not found');
  });
});

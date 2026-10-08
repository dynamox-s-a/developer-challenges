import request from 'supertest';
import { authCookie, resetDatabase, UNKNOWN_ID } from '../../../tests/helpers';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

const app = createApp();
const cookie = authCookie();

function listPoints(query: Record<string, string | number> = {}) {
  return request(app)
    .get('/api/v1/monitoring-points')
    .query(query)
    .set('Cookie', cookie);
}

function createPoint(machineId: string, body: object) {
  return request(app)
    .post(`/api/v1/machines/${machineId}/monitoring-points`)
    .set('Cookie', cookie)
    .send(body);
}

function updatePoint(id: string, body: object) {
  return request(app)
    .put(`/api/v1/monitoring-points/${id}`)
    .set('Cookie', cookie)
    .send(body);
}

function deletePoint(id: string) {
  return request(app)
    .delete(`/api/v1/monitoring-points/${id}`)
    .set('Cookie', cookie);
}

function createMachine() {
  return prisma.machine.create({ data: { name: 'Bomba 01', type: 'Pump' } });
}

/**
 * Six points chosen so every sort column, in both directions, yields a
 * distinct order: names tie within a machine, types tie across machines, and
 * two points have no sensor. Point names are unique, so tests compare them.
 */
async function seedListingFixture() {
  const fixture = [
    {
      machine: 'Alpha',
      type: 'Fan',
      points: [
        ['P3', 'TcAs'],
        ['P5', 'HFPlus'],
      ],
    },
    {
      machine: 'Bravo',
      type: 'Pump',
      points: [
        ['P1', 'HFPlus'],
        ['P6', null],
      ],
    },
    {
      machine: 'Charlie',
      type: 'Fan',
      points: [
        ['P2', null],
        ['P4', 'TcAg'],
      ],
    },
  ] as const;
  for (const { machine, type, points } of fixture) {
    await prisma.machine.create({
      data: {
        name: machine,
        type,
        monitoringPoints: {
          create: points.map(([name, model]) => ({
            name,
            sensor: model
              ? { create: { serialNumber: `SN-${name}`, model } }
              : undefined,
          })),
        },
      },
    });
  }
}

function pointNames(res: request.Response): string[] {
  return res.body.data.map((point: { name: string }) => point.name);
}

/** A point on a new machine, with an HF+ sensor that has one reading. */
async function pointWithSensorAndReading() {
  const machine = await createMachine();
  const point = await prisma.monitoringPoint.create({
    data: {
      name: 'Mancal',
      machineId: machine.id,
      sensor: { create: { serialNumber: 'HFP-1', model: 'HFPlus' } },
    },
    include: { sensor: true },
  });
  await prisma.reading.create({
    data: { sensorId: point.sensor!.id, timestamp: new Date(), value: 2 },
  });
  return { machine, point };
}

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

describe('monitoring point routes', () => {
  it.each([
    ['GET', '/api/v1/monitoring-points'],
    ['GET', `/api/v1/monitoring-points/${UNKNOWN_ID}`],
    ['POST', `/api/v1/machines/${UNKNOWN_ID}/monitoring-points`],
    ['PUT', `/api/v1/monitoring-points/${UNKNOWN_ID}`],
    ['DELETE', `/api/v1/monitoring-points/${UNKNOWN_ID}`],
  ])('%s %s requires a session', async (method, path) => {
    const res =
      await request(app)[
        method.toLowerCase() as 'get' | 'post' | 'put' | 'delete'
      ](path);

    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/monitoring-points', () => {
  it('returns the first 5 points by machine name, with machine and sensor', async () => {
    await seedListingFixture();

    const res = await listPoints();

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      page: 1,
      pageSize: 5,
      total: 6,
      totalPages: 2,
    });
    expect(pointNames(res)).toEqual(['P3', 'P5', 'P1', 'P6', 'P2']);
    expect(res.body.data[0]).toEqual({
      id: expect.any(String),
      name: 'P3',
      machine: { id: expect.any(String), name: 'Alpha', type: 'Fan' },
      sensor: {
        id: expect.any(String),
        serialNumber: 'SN-P3',
        model: 'TcAs',
        monitoringPointId: res.body.data[0].id,
        createdAt: expect.any(String),
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(res.body.data[3].sensor).toBeNull();
  });

  it('returns the remaining points on the last page without overlap', async () => {
    await seedListingFixture();

    const res = await listPoints({ page: 2 });

    expect(res.status).toBe(200);
    expect(pointNames(res)).toEqual(['P4']);
    expect(res.body.meta).toMatchObject({ page: 2, total: 6, totalPages: 2 });
  });

  it('returns an empty page past the last one', async () => {
    await seedListingFixture();

    const res = await listPoints({ page: 3 });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toMatchObject({ page: 3, total: 6, totalPages: 2 });
  });

  it('honours a custom page size', async () => {
    await seedListingFixture();

    const res = await listPoints({ pageSize: 2, page: 3 });

    expect(pointNames(res)).toEqual(['P2', 'P4']);
    expect(res.body.meta).toEqual({
      page: 3,
      pageSize: 2,
      total: 6,
      totalPages: 3,
    });
  });

  it('returns an empty list when there are no points', async () => {
    const res = await listPoints();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      meta: { page: 1, pageSize: 5, total: 0, totalPages: 0 },
    });
  });

  // Ties fall back to machine name, then point name. Enums sort
  // alphabetically (Fan < Pump, HF+ < TcAg < TcAs); points without a sensor
  // come last in asc and first in desc.
  it.each([
    ['machineName', 'asc', ['P3', 'P5', 'P1', 'P6', 'P2', 'P4']],
    ['machineName', 'desc', ['P2', 'P4', 'P1', 'P6', 'P3', 'P5']],
    ['machineType', 'asc', ['P3', 'P5', 'P2', 'P4', 'P1', 'P6']],
    ['machineType', 'desc', ['P1', 'P6', 'P3', 'P5', 'P2', 'P4']],
    ['pointName', 'asc', ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']],
    ['pointName', 'desc', ['P6', 'P5', 'P4', 'P3', 'P2', 'P1']],
    ['sensorModel', 'asc', ['P5', 'P1', 'P4', 'P3', 'P6', 'P2']],
    ['sensorModel', 'desc', ['P6', 'P2', 'P3', 'P4', 'P5', 'P1']],
  ])('sorts by %s %s', async (sortBy, sortDir, expected) => {
    await seedListingFixture();

    const res = await listPoints({ sortBy, sortDir, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(pointNames(res)).toEqual(expected);
  });

  it('keeps the sort order across pages', async () => {
    await seedListingFixture();

    const query = { sortBy: 'pointName', sortDir: 'desc' };
    const first = await listPoints({ ...query, page: 1 });
    const second = await listPoints({ ...query, page: 2 });

    expect([...pointNames(first), ...pointNames(second)]).toEqual([
      'P6',
      'P5',
      'P4',
      'P3',
      'P2',
      'P1',
    ]);
  });

  it.each([
    ['an unknown sort field', { sortBy: 'createdAt' }],
    ['a nested Prisma path as sort field', { sortBy: 'machine.name' }],
    ['an unknown sort direction', { sortDir: 'up' }],
    ['page 0', { page: 0 }],
    ['a non-numeric page', { page: 'abc' }],
    ['a page size over the maximum', { pageSize: 101 }],
  ])('rejects %s with 400', async (_, query) => {
    const res = await listPoints(query);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/monitoring-points/:id', () => {
  function getPoint(id: string) {
    return request(app)
      .get(`/api/v1/monitoring-points/${id}`)
      .set('Cookie', cookie);
  }

  it('returns the point with its machine and sensor', async () => {
    const { machine, point } = await pointWithSensorAndReading();

    const res = await getPoint(point.id);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: point.id,
      name: 'Mancal',
      machine: { id: machine.id, name: 'Bomba 01', type: 'Pump' },
      sensor: {
        id: point.sensor!.id,
        serialNumber: 'HFP-1',
        model: 'HF+',
        monitoringPointId: point.id,
        createdAt: point.sensor!.createdAt.toISOString(),
      },
      createdAt: point.createdAt.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
    });
  });

  it('returns a null sensor for a point without one', async () => {
    const machine = await createMachine();
    const created = await createPoint(machine.id, { name: 'Carcaça' });

    const res = await getPoint(created.body.id);

    expect(res.status).toBe(200);
    expect(res.body.sensor).toBeNull();
  });

  it('returns 404 for an unknown point', async () => {
    const res = await getPoint(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Monitoring point not found');
  });

  it('rejects an id that is not a uuid with 400', async () => {
    const res = await getPoint('not-a-uuid');

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/machines/:machineId/monitoring-points', () => {
  it('creates a point without a sensor', async () => {
    const machine = await createMachine();

    const res = await createPoint(machine.id, { name: '  Mancal dianteiro ' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Mancal dianteiro',
      machineId: machine.id,
      sensor: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('allows several points on the same machine', async () => {
    const machine = await createMachine();

    await createPoint(machine.id, { name: 'Mancal dianteiro' });
    await createPoint(machine.id, { name: 'Mancal traseiro' });

    expect(
      await prisma.monitoringPoint.count({ where: { machineId: machine.id } }),
    ).toBe(2);
  });

  it('returns 404 when the machine does not exist', async () => {
    const res = await createPoint(UNKNOWN_ID, { name: 'Mancal' });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Machine not found');
  });

  it.each([
    ['an empty name', { name: '  ' }],
    ['a name over 100 characters', { name: 'x'.repeat(101) }],
    ['a missing name', {}],
  ])('rejects %s with 400', async (_, body) => {
    const machine = await createMachine();

    const res = await createPoint(machine.id, body);

    expect(res.status).toBe(400);
    expect(await prisma.monitoringPoint.count()).toBe(0);
  });

  it('rejects a machine id that is not a uuid with 400', async () => {
    const res = await createPoint('42', { name: 'Mancal' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/v1/monitoring-points/:id', () => {
  it('renames the point and keeps its sensor', async () => {
    const { point } = await pointWithSensorAndReading();

    const res = await updatePoint(point.id, { name: 'Mancal traseiro' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: point.id,
      name: 'Mancal traseiro',
      sensor: { serialNumber: 'HFP-1', model: 'HF+' },
    });
  });

  it('ignores an attempt to move the point to another machine', async () => {
    const { machine, point } = await pointWithSensorAndReading();
    const other = await createMachine();

    const res = await updatePoint(point.id, {
      name: 'Mancal',
      machineId: other.id,
    });

    expect(res.status).toBe(200);
    expect(res.body.machineId).toBe(machine.id);
  });

  it('returns 404 for an unknown point', async () => {
    const res = await updatePoint(UNKNOWN_ID, { name: 'Mancal' });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Monitoring point not found');
  });

  it('rejects an invalid body with 400', async () => {
    const { point } = await pointWithSensorAndReading();

    const res = await updatePoint(point.id, { name: '' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/v1/monitoring-points/:id', () => {
  it('deletes the point with its sensor and readings, keeping the machine', async () => {
    const { machine, point } = await pointWithSensorAndReading();

    const res = await deletePoint(point.id);

    expect(res.status).toBe(204);
    expect(await prisma.monitoringPoint.count()).toBe(0);
    expect(await prisma.sensor.count()).toBe(0);
    expect(await prisma.reading.count()).toBe(0);
    expect(await prisma.machine.count({ where: { id: machine.id } })).toBe(1);
  });

  it('returns 404 for an unknown point', async () => {
    const res = await deletePoint(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Monitoring point not found');
  });
});

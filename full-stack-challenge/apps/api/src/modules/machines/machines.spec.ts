import request from 'supertest';
import { authCookie, resetDatabase, UNKNOWN_ID } from '../../../tests/helpers';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

const app = createApp();
const cookie = authCookie();

function api() {
  return {
    list: (query = '') =>
      request(app).get(`/api/v1/machines${query}`).set('Cookie', cookie),
    get: (id: string) =>
      request(app).get(`/api/v1/machines/${id}`).set('Cookie', cookie),
    create: (body: object) =>
      request(app).post('/api/v1/machines').set('Cookie', cookie).send(body),
    update: (id: string, body: object) =>
      request(app)
        .put(`/api/v1/machines/${id}`)
        .set('Cookie', cookie)
        .send(body),
    remove: (id: string) =>
      request(app).delete(`/api/v1/machines/${id}`).set('Cookie', cookie),
  };
}

/** A machine with one point per sensor model given (null = point without sensor). */
async function machineWithSensors(
  type: 'Pump' | 'Fan',
  models: ('TcAg' | 'TcAs' | 'HFPlus' | null)[],
) {
  return prisma.machine.create({
    data: {
      name: `${type} with sensors`,
      type,
      monitoringPoints: {
        create: models.map((model, i) => ({
          name: `Point ${i + 1}`,
          ...(model && {
            sensor: { create: { serialNumber: `SN-${type}-${i}`, model } },
          }),
        })),
      },
    },
  });
}

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

describe('machines routes', () => {
  it.each([
    ['GET', '/api/v1/machines'],
    ['GET', `/api/v1/machines/${UNKNOWN_ID}`],
    ['POST', '/api/v1/machines'],
    ['PUT', `/api/v1/machines/${UNKNOWN_ID}`],
    ['DELETE', `/api/v1/machines/${UNKNOWN_ID}`],
  ])('%s %s requires a session', async (method, path) => {
    const res =
      await request(app)[
        method.toLowerCase() as 'get' | 'post' | 'put' | 'delete'
      ](path);

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/machines', () => {
  it('creates a machine', async () => {
    const res = await api().create({ name: '  Bomba 01 ', type: 'Pump' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Bomba 01',
      type: 'Pump',
      monitoringPointsCount: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(await prisma.machine.count()).toBe(1);
  });

  it.each([
    ['an empty name', { name: '   ', type: 'Fan' }],
    ['a name over 100 characters', { name: 'x'.repeat(101), type: 'Fan' }],
    ['an unknown type', { name: 'Compressor', type: 'Compressor' }],
    ['a missing type', { name: 'Bomba' }],
  ])('rejects %s with 400', async (_, body) => {
    const res = await api().create(body);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(await prisma.machine.count()).toBe(0);
  });
});

describe('GET /api/v1/machines', () => {
  async function createMachines(names: string[]) {
    for (const [i, name] of names.entries()) {
      await prisma.machine.create({
        data: {
          name,
          type: i % 2 ? 'Fan' : 'Pump',
          createdAt: new Date(Date.UTC(2026, 0, i + 1)),
        },
      });
    }
  }

  it('returns the first page, newest first, with pagination meta', async () => {
    await createMachines([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
    ]);

    const res = await api().list();

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      page: 1,
      pageSize: 10,
      total: 12,
      totalPages: 2,
    });
    expect(res.body.data).toHaveLength(10);
    expect(res.body.data[0].name).toBe('L');
  });

  it('returns later pages', async () => {
    await createMachines(['A', 'B', 'C', 'D', 'E']);

    const res = await api().list('?page=2&pageSize=2');

    expect(res.body.data.map((m: { name: string }) => m.name)).toEqual([
      'C',
      'B',
    ]);
    expect(res.body.meta).toMatchObject({ page: 2, totalPages: 3 });
  });

  it('returns an empty page past the end', async () => {
    await createMachines(['A']);

    const res = await api().list('?page=5');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(1);
  });

  it('sorts by the requested field and direction', async () => {
    await createMachines(['Charlie', 'alpha', 'Bravo']);

    const asc = await api().list('?sortBy=name&sortDir=asc');
    const desc = await api().list('?sortBy=name&sortDir=desc');

    const names = (res: request.Response) =>
      res.body.data.map((m: { name: string }) => m.name);
    expect(names(asc)).toEqual([...names(desc)].reverse());
  });

  it('sorts types alphabetically, not by enum declaration order', async () => {
    await createMachines(['Pump 1', 'Fan 1']);

    const res = await api().list('?sortBy=type&sortDir=asc');

    expect(res.body.data.map((m: { type: string }) => m.type)).toEqual([
      'Fan',
      'Pump',
    ]);
  });

  it('counts monitoring points per machine', async () => {
    await machineWithSensors('Fan', ['TcAg', null]);

    const res = await api().list();

    expect(res.body.data[0].monitoringPointsCount).toBe(2);
  });

  it.each([
    ['an unknown sortBy', '?sortBy=password'],
    ['a pageSize over 100', '?pageSize=101'],
    ['page 0', '?page=0'],
  ])('rejects %s with 400', async (_, query) => {
    const res = await api().list(query);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/machines/:id', () => {
  it('returns the machine with its points and sensors', async () => {
    const machine = await machineWithSensors('Fan', ['HFPlus', null]);

    const res = await api().get(machine.id);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: machine.id, type: 'Fan' });
    expect(res.body.monitoringPoints).toEqual([
      expect.objectContaining({
        name: 'Point 1',
        sensor: expect.objectContaining({
          serialNumber: 'SN-Fan-0',
          model: 'HF+', // stored as HFPlus, exposed as HF+
        }),
      }),
      expect.objectContaining({ name: 'Point 2', sensor: null }),
    ]);
  });

  it('returns 404 for an unknown machine', async () => {
    const res = await api().get(UNKNOWN_ID);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Machine not found');
  });

  it('returns 400 for an id that is not a uuid', async () => {
    const res = await api().get('42');

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/v1/machines/:id', () => {
  it('updates name and type', async () => {
    const machine = await machineWithSensors('Pump', []);

    const res = await api().update(machine.id, {
      name: 'Ventilador 02',
      type: 'Fan',
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Ventilador 02', type: 'Fan' });
  });

  it.each([['TcAg'], ['TcAs']] as const)(
    'refuses to turn a fan with a %s sensor into a pump',
    async (model) => {
      const machine = await machineWithSensors('Fan', [model, 'HFPlus']);

      const res = await api().update(machine.id, {
        name: machine.name,
        type: 'Pump',
      });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatchObject({
        code: 'BUSINESS_RULE_VIOLATION',
        details: { sensors: [{ serialNumber: 'SN-Fan-0', model }] },
      });
      const stored = await prisma.machine.findUniqueOrThrow({
        where: { id: machine.id },
      });
      expect(stored.type).toBe('Fan');
    },
  );

  it('turns a fan into a pump when all its sensors are HF+', async () => {
    const machine = await machineWithSensors('Fan', ['HFPlus', null]);

    const res = await api().update(machine.id, {
      name: machine.name,
      type: 'Pump',
    });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('Pump');
  });

  it('returns 404 for an unknown machine', async () => {
    const res = await api().update(UNKNOWN_ID, { name: 'X', type: 'Fan' });

    expect(res.status).toBe(404);
  });

  it('rejects an invalid body with 400', async () => {
    const machine = await machineWithSensors('Fan', []);

    const res = await api().update(machine.id, { name: 'X' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/v1/machines/:id', () => {
  it('deletes the machine and cascades to points, sensors and readings', async () => {
    const machine = await machineWithSensors('Fan', ['TcAg']);
    const sensor = await prisma.sensor.findFirstOrThrow();
    await prisma.reading.create({
      data: { sensorId: sensor.id, timestamp: new Date(), value: 1.5 },
    });

    const res = await api().remove(machine.id);

    expect(res.status).toBe(204);
    expect(await prisma.machine.count()).toBe(0);
    expect(await prisma.monitoringPoint.count()).toBe(0);
    expect(await prisma.sensor.count()).toBe(0);
    expect(await prisma.reading.count()).toBe(0);
  });

  it('returns 404 for an unknown machine', async () => {
    const res = await api().remove(UNKNOWN_ID);

    expect(res.status).toBe(404);
  });
});

import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { app } from '../../app.ts';
import { AppError } from '../../errors/app-error.ts';
import { signToken } from '../../lib/jwt.ts';
import * as service from './monitoring-points.service.ts';

// Mesmo esquema do teste das rotas de máquinas: env falso e service falso
vi.mock('../../config/env.ts', () => ({
  env: {
    JWT_SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
    JWT_EXPIRES_IN: 3600,
  },
}));
vi.mock('../../lib/prisma.ts', () => ({ prisma: {} }));
vi.mock('./monitoring-points.service.ts');

const point = {
  id: 'point-1',
  name: 'Mancal LA',
  machineId: 'machine-1',
  createdAt: new Date('2026-11-22T10:00:00Z'),
  updatedAt: new Date('2026-11-22T10:00:00Z'),
};

const sensor = {
  id: 'sensor-1',
  model: 'TcAg',
  serialNumber: 'DyL1.01.A0000',
  monitoringPointId: 'point-1',
  createdAt: new Date('2026-11-22T10:00:00Z'),
  updatedAt: new Date('2026-11-22T10:00:00Z'),
};

const token = signToken({ sub: 'user-1', email: 'admin@dynamox.com' });

type ErrorBody = { error: { code: string; message: string } };

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;
  // As rotas de pontos ficam em dois caminhos, então a base é só o /api
  baseUrl = `http://127.0.0.1:${port}/api`;
});

afterAll(() => {
  server.close();
});

function request(path: string, init: RequestInit = {}, { auth = true } = {}) {
  return fetch(baseUrl + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

describe('monitoring points routes', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should reject requests without a token', async () => {
    const create = await request(
      '/machines/machine-1/monitoring-points',
      { method: 'POST', body: JSON.stringify({ name: 'Mancal LA' }) },
      { auth: false },
    );
    const remove = await request(
      '/monitoring-points/point-1',
      { method: 'DELETE' },
      { auth: false },
    );

    expect(create.status).toBe(401);
    expect(remove.status).toBe(401);
    expect(service.createMonitoringPoint).not.toHaveBeenCalled();
    expect(service.deleteMonitoringPoint).not.toHaveBeenCalled();
  });

  it('should create a point in the machine from the url and answer 201', async () => {
    vi.mocked(service.createMonitoringPoint).mockResolvedValue(point);

    const response = await request('/machines/machine-1/monitoring-points', {
      method: 'POST',
      body: JSON.stringify({ name: '  Mancal LA  ' }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      id: 'point-1',
      name: 'Mancal LA',
      machineId: 'machine-1',
      createdAt: '2026-11-22T10:00:00.000Z',
      updatedAt: '2026-11-22T10:00:00.000Z',
    });
    // O id da máquina veio da URL; o nome, do corpo (já sem os espaços)
    expect(service.createMonitoringPoint).toHaveBeenCalledWith('machine-1', {
      name: 'Mancal LA',
    });
  });

  it('should answer 400 and not create anything when the name is blank', async () => {
    const response = await request('/machines/machine-1/monitoring-points', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(service.createMonitoringPoint).not.toHaveBeenCalled();
  });

  it('should answer 404 when the machine does not exist', async () => {
    vi.mocked(service.createMonitoringPoint).mockRejectedValue(
      new AppError(404, 'NOT_FOUND', 'Máquina não encontrada'),
    );

    const response = await request('/machines/nao-existe/monitoring-points', {
      method: 'POST',
      body: JSON.stringify({ name: 'Mancal LA' }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(404);
    expect(body.error.message).toBe('Máquina não encontrada');
  });

  it('should delete a point and answer 204', async () => {
    const response = await request('/monitoring-points/point-1', {
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
    expect(service.deleteMonitoringPoint).toHaveBeenCalledWith('point-1');
  });

  it('should put a sensor on the point and answer 200', async () => {
    vi.mocked(service.setSensor).mockResolvedValue(sensor);

    const response = await request('/monitoring-points/point-1/sensor', {
      method: 'PUT',
      body: JSON.stringify({ model: 'TcAg', serialNumber: 'dyl1.01.a0000' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: 'sensor-1',
      model: 'TcAg',
      serialNumber: 'DyL1.01.A0000',
    });
    // O número chega ao service no formato padrão, mesmo digitado em minúsculas
    expect(service.setSensor).toHaveBeenCalledWith('point-1', {
      model: 'TcAg',
      serialNumber: 'DyL1.01.A0000',
    });
  });

  it('should answer 400 when the serial number is from another model', async () => {
    const response = await request('/monitoring-points/point-1/sensor', {
      method: 'PUT',
      body: JSON.stringify({ model: 'HF+', serialNumber: 'DyL1.01.A0000' }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(service.setSensor).not.toHaveBeenCalled();
  });

  it('should remove only the sensor and answer 204', async () => {
    const response = await request('/monitoring-points/point-1/sensor', {
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
    expect(service.removeSensor).toHaveBeenCalledWith('point-1');
    expect(service.deleteMonitoringPoint).not.toHaveBeenCalled();
  });
});

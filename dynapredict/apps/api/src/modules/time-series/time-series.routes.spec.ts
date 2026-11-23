import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { MAX_TIME_SERIES_SAMPLES } from '@dynapredict/shared';
import { app } from '../../app.ts';
import { signToken } from '../../lib/jwt.ts';
import * as service from './time-series.service.ts';

// Mesmo esquema dos outros testes de rotas: env falso e service falso
vi.mock('../../config/env.ts', () => ({
  env: {
    JWT_SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
    JWT_EXPIRES_IN: 3600,
  },
}));
vi.mock('../../lib/prisma.ts', () => ({ prisma: {} }));
vi.mock('./time-series.service.ts');

const summary = {
  id: 'series-1',
  name: 'Temperatura',
  unit: null,
  sensorSerialNumber: 'DyL4.01.A0000',
  monitoringPointId: 'point-1',
  sampleCount: 2,
  startedAt: new Date('2026-11-22T10:00:00Z'),
  endedAt: new Date('2026-11-22T10:10:00Z'),
  createdAt: new Date('2026-11-22T12:00:00Z'),
};

// count medições, uma por minuto a partir de 22/11/2026 00:00 (UTC)
function samples(count: number) {
  const start = Date.UTC(2026, 10, 22);
  return Array.from({ length: count }, (_, index) => ({
    timestamp: new Date(start + index * 60_000).toISOString(),
    value: index,
  }));
}

const token = signToken({ sub: 'user-1', email: 'admin@dynamox.com' });

type ErrorBody = { error: { code: string; message: string } };

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}/api/monitoring-points/point-1/time-series`;
});

afterAll(() => {
  server.close();
});

function request(init: RequestInit = {}, { auth = true } = {}) {
  return fetch(baseUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

describe('time series routes', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should reject requests without a token', async () => {
    const list = await request({}, { auth: false });
    const create = await request(
      {
        method: 'POST',
        body: JSON.stringify({ name: 'Temperatura', samples: samples(2) }),
      },
      { auth: false },
    );

    expect(list.status).toBe(401);
    expect(create.status).toBe(401);
    expect(service.listTimeSeries).not.toHaveBeenCalled();
    expect(service.createTimeSeries).not.toHaveBeenCalled();
  });

  it('should save a series on the point from the url and answer 201', async () => {
    vi.mocked(service.createTimeSeries).mockResolvedValue(summary);

    const response = await request({
      method: 'POST',
      body: JSON.stringify({
        name: '  Temperatura  ',
        unit: '',
        samples: [
          { timestamp: '2026-11-22T07:00:00-03:00', value: 31.5 },
          { timestamp: '2026-11-22T10:10:00Z', value: 32 },
        ],
      }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ...summary,
      startedAt: '2026-11-22T10:00:00.000Z',
      endedAt: '2026-11-22T10:10:00.000Z',
      createdAt: '2026-11-22T12:00:00.000Z',
    });
    // O service recebe os dados já validados: instantes como datas
    expect(service.createTimeSeries).toHaveBeenCalledWith('point-1', {
      name: 'Temperatura',
      unit: null,
      samples: [
        { timestamp: new Date('2026-11-22T10:00:00Z'), value: 31.5 },
        { timestamp: new Date('2026-11-22T10:10:00Z'), value: 32 },
      ],
    });
  });

  it('should answer 400 and save nothing when two samples share an instant', async () => {
    const response = await request({
      method: 'POST',
      body: JSON.stringify({
        name: 'Temperatura',
        samples: [
          { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
          { timestamp: '2026-11-22T07:00:00-03:00', value: 32 },
        ],
      }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(service.createTimeSeries).not.toHaveBeenCalled();
  });

  it('should accept the maximum number of samples, above the 100 KB default', async () => {
    vi.mocked(service.createTimeSeries).mockResolvedValue(summary);
    const body = JSON.stringify({
      name: 'Temperatura',
      samples: samples(MAX_TIME_SERIES_SAMPLES),
    });
    expect(body.length).toBeGreaterThan(100 * 1024);

    const response = await request({ method: 'POST', body });

    expect(response.status).toBe(201);
    expect(service.createTimeSeries).toHaveBeenCalledWith(
      'point-1',
      expect.objectContaining({
        samples: expect.arrayContaining([
          { timestamp: expect.any(Date), value: MAX_TIME_SERIES_SAMPLES - 1 },
        ]),
      }),
    );
  });

  it('should answer 413 when the body is over the limit', async () => {
    const response = await request({
      method: 'POST',
      body: JSON.stringify({
        name: 'Temperatura',
        samples: [],
        filler: 'a'.repeat(2 * 1024 * 1024),
      }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(413);
    expect(body.error.code).toBe('PAYLOAD_TOO_LARGE');
    expect(service.createTimeSeries).not.toHaveBeenCalled();
  });

  it('should list the series of the point from the url', async () => {
    vi.mocked(service.listTimeSeries).mockResolvedValue([summary]);

    const response = await request();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      expect.objectContaining({ id: 'series-1', name: 'Temperatura' }),
    ]);
    expect(service.listTimeSeries).toHaveBeenCalledWith('point-1');
  });
});

import request from 'supertest';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';
import { isDatabaseUp } from './health.service';

const app = createApp();

function databaseFails() {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  return vi.spyOn(prisma, '$queryRaw');
}

afterEach(() => vi.restoreAllMocks());
afterAll(() => prisma.$disconnect());

describe('GET /api/v1/health', () => {
  it('reports ok without a session when the database answers', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up' });
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('reports degraded with 503 when the database is down, without details', async () => {
    databaseFails().mockRejectedValueOnce(
      new Error('connect ECONNREFUSED 10.0.0.5:5432'),
    );

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'degraded', db: 'down' });
    expect(res.text).not.toContain('ECONNREFUSED');
    expect(res.headers['cache-control']).toBe('no-store');
  });
});

describe('isDatabaseUp', () => {
  it('is true when SELECT 1 succeeds', async () => {
    expect(await isDatabaseUp()).toBe(true);
  });

  it('is false when the database does not answer within the timeout', async () => {
    const hang = new Promise<never>(() => undefined);
    databaseFails().mockReturnValueOnce(hang as never);

    const started = Date.now();
    expect(await isDatabaseUp(50)).toBe(false);
    expect(Date.now() - started).toBeLessThan(1000);
    expect(console.error).toHaveBeenCalledWith(
      'Health check: database unavailable',
      expect.objectContaining({
        message: 'Database check timed out after 50ms',
      }),
    );
  });
});

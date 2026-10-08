import request from 'supertest';
import { createApp } from './app';

const app = createApp();

describe('app', () => {
  it('returns a 404 in the standard error shape for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nope');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Route GET /api/v1/nope not found',
    });
  });

  it('does not advertise Express', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  describe('CORS', () => {
    it('allows the configured origin with credentials', async () => {
      const res = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'http://localhost:4200')
        .set('Access-Control-Request-Method', 'POST');

      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-origin']).toBe(
        'http://localhost:4200',
      );
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('does not allow other origins', async () => {
      const res = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'https://evil.example.com')
        .set('Access-Control-Request-Method', 'POST');

      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});

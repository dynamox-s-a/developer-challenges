import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

/**
 * Runs the real application on a random port and talks to it over HTTP. Only behaviour
 * decided before any query runs is tested here: the database is not needed.
 */
describe('API over HTTP', () => {
  let app: NestExpressApplication;
  let baseUrl: string;

  beforeAll(async () => {
    // The client only needs a URL to be built; no route here reaches the database.
    process.env.DATABASE_URL ??= 'postgresql://unused@localhost:5432/unused';
    process.env.JWT_SECRET ??= 'unit-test-secret-of-at-least-32-characters';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
    configureApp(app);
    await app.listen(0);
    baseUrl = `${await app.getUrl()}/api`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('answers the health check without a session', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('answers an unknown route with a Problem Details 404', async () => {
    const response = await fetch(`${baseUrl}/nothing-here`);

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toContain('application/problem+json');
    expect(await response.json()).toEqual({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Cannot GET /api/nothing-here',
    });
  });

  it('serves routes only under the /api prefix', async () => {
    const response = await fetch(baseUrl.replace(/\/api$/, '/health'));

    expect(response.status).toBe(404);
  });

  it('closes a private route to a request without a session', async () => {
    const response = await fetch(`${baseUrl}/auth/me`);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: 'Authentication required.',
    });
  });

  it('closes a private route to a forged session cookie', async () => {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: 'session=not-a-real-token' },
    });

    expect(response.status).toBe(401);
  });

  it('rejects an invalid login body with 422 naming each field, before any query', async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not an email' }),
    });

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      type: 'urn:condition-monitor:error:validation',
      title: 'Invalid request',
      status: 422,
      detail: '2 fields are invalid.',
      errors: [
        { field: 'email', message: 'Must be a valid email address.' },
        { field: 'password', message: 'Invalid input: expected string, received undefined' },
      ],
    });
  });
});

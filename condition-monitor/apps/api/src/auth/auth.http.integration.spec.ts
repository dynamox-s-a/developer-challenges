import type { NestExpressApplication } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { configureApp } from '../app/configure-app';
import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

const credentials = { email: 'operator@plant.test', password: 'correct horse battery' };

/** The whole login flow over HTTP, against the test database. */
describe('authentication over HTTP', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
    configureApp(app);
    await app.listen(0);
    baseUrl = `${await app.getUrl()}/api`;
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
    await seedUser(prisma, credentials);
  });

  afterAll(async () => {
    await app.close();
  });

  function login(body: unknown) {
    return fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  function sessionCookieOf(response: Response): string {
    const cookie = response.headers.getSetCookie().find((value) => value.startsWith('session='));
    if (!cookie) throw new Error('No session cookie was set.');
    return cookie;
  }

  function me(cookie?: string) {
    return fetch(`${baseUrl}/auth/me`, { headers: cookie ? { Cookie: cookie } : {} });
  }

  it('logs in with the seeded credentials and sets a protected session cookie', async () => {
    const response = await login(credentials);

    expect(response.status).toBe(204);
    const cookie = sessionCookieOf(response);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Strict/);
    expect(cookie).toMatch(/Path=\/api/);
    expect(cookie).toMatch(/Max-Age=3600/);
  });

  it('accepts the email in any casing, as the schema normalizes it', async () => {
    const response = await login({ ...credentials, email: ' Operator@Plant.TEST ' });

    expect(response.status).toBe(204);
  });

  it('answers who is logged in with the session cookie', async () => {
    const cookie = sessionCookieOf(await login(credentials)).split(';')[0];

    const response = await me(cookie);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      email: credentials.email,
    });
  });

  it('rejects a wrong password with 401 and sets no cookie', async () => {
    const response = await login({ ...credentials, password: 'wrong password' });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ detail: 'Invalid email or password.' });
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it('logs out by clearing the cookie', async () => {
    const cookie = sessionCookieOf(await login(credentials)).split(';')[0];

    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(204);
    expect(sessionCookieOf(response)).toMatch(/^session=;.*Expires=Thu, 01 Jan 1970/);
  });

  it('refuses an expired session', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: credentials.email } });
    const expired = await app
      .get(JwtService)
      .signAsync({ sub: user.id, email: user.email }, { expiresIn: -1 });

    const response = await me(`session=${expired}`);

    expect(response.status).toBe(401);
  });

  it('refuses a valid session whose user no longer exists', async () => {
    const cookie = sessionCookieOf(await login(credentials)).split(';')[0];
    await resetDatabase(prisma);

    const response = await me(cookie);

    expect(response.status).toBe(401);
  });
});

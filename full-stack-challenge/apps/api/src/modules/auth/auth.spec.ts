import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../app';
import { AUTH_COOKIE_NAME } from '../../config/auth';

// Credentials and secret come from vitest.setup.ts.
const EMAIL = 'admin@dynapredict.com';
const PASSWORD = 'dynapredict123';
const SECRET = 'test-secret-with-at-least-32-characters';

const app = createApp();

function setCookieHeader(res: request.Response): string {
  const cookies = res.headers['set-cookie'] as unknown as string[] | undefined;
  const authCookie = cookies?.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!authCookie) throw new Error('auth cookie was not set');
  return authCookie;
}

function cookieWith(token: string) {
  return `${AUTH_COOKIE_NAME}=${token}`;
}

async function loginCookie() {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: EMAIL, password: PASSWORD });
  return setCookieHeader(res).split(';')[0];
}

describe('POST /api/v1/auth/login', () => {
  it('returns the user and sets an httpOnly session cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: EMAIL, password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: { email: EMAIL } });

    const cookie = setCookieHeader(res);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).toMatch(/Path=\//i);
    expect(cookie).toMatch(/Max-Age=3600/i); // JWT_EXPIRES_IN=1h in tests
  });

  it('issues a token whose subject is the user', async () => {
    const token = (await loginCookie()).split('=')[1];

    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
    expect(payload.sub).toBe(EMAIL);
    expect(payload.exp).toBeGreaterThan(Date.now() / 1000);
  });

  it('accepts the email regardless of case and surrounding spaces', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: '  Admin@Dynapredict.com ', password: PASSWORD });

    expect(res.status).toBe(200);
  });

  it.each([
    ['a wrong password', { email: EMAIL, password: 'wrong-password' }],
    [
      'an unknown email',
      { email: 'other@dynapredict.com', password: PASSWORD },
    ],
  ])('rejects %s with the same 401 and no cookie', async (_, credentials) => {
    const res = await request(app).post('/api/v1/auth/login').send(credentials);

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    });
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it.each([
    ['a missing password', { email: EMAIL }],
    ['an invalid email', { email: 'admin', password: PASSWORD }],
    ['an empty body', {}],
  ])('rejects %s with 400', async (_, body) => {
    const res = await request(app).post('/api/v1/auth/login').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns the logged-in user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', await loginCookie());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: { email: EMAIL } });
  });

  it('returns 401 without a session cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it.each([
    ['an expired token', jwt.sign({ sub: EMAIL, exp: 1 }, SECRET)],
    [
      'a token signed with another secret',
      jwt.sign({ sub: EMAIL }, 'x'.repeat(40)),
    ],
    ['a token without a subject', jwt.sign({}, SECRET)],
    [
      'an unsigned "alg: none" token',
      jwt.sign({ sub: EMAIL }, '', { algorithm: 'none' }),
    ],
    ['garbage', 'not-a-jwt'],
  ])('returns 401 for %s', async (_, token) => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookieWith(token));

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('clears the session cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', await loginCookie());

    expect(res.status).toBe(204);
    const cookie = setCookieHeader(res);
    expect(cookie).toMatch(new RegExp(`^${AUTH_COOKIE_NAME}=;`));
    expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/);
    expect(cookie).toMatch(/Path=\//i);
  });
});

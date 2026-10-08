import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { AUTH_COOKIE_NAME } from '../config/auth';
import { errorHandler } from './errorHandler';
import { requireAuth } from './requireAuth';

// Secret from vitest.setup.ts.
const SECRET = 'test-secret-with-at-least-32-characters';
const EMAIL = 'admin@dynapredict.com';

let handlerCalls = 0;
function handler(_req: express.Request, res: express.Response) {
  handlerCalls += 1;
  res.json({ user: res.locals.user });
}

const app = express();
app.use(cookieParser());
app.get('/private', requireAuth, handler);
app.use(errorHandler);

function sessionCookie(token: string) {
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('requireAuth', () => {
  beforeEach(() => {
    handlerCalls = 0;
  });

  it('lets a valid session through and exposes the user', async () => {
    const token = jwt.sign({}, SECRET, { subject: EMAIL, expiresIn: '1h' });

    const res = await request(app)
      .get('/private')
      .set('Cookie', sessionCookie(token));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: { email: EMAIL } });
    expect(handlerCalls).toBe(1);
  });

  it.each([
    ['no cookie', undefined],
    ['an expired token', jwt.sign({ sub: EMAIL, exp: 1 }, SECRET)],
    [
      'a forged token',
      jwt.sign({ sub: EMAIL }, 'another-secret-of-40-characters-long!!'),
    ],
  ])('blocks %s with 401 before the handler runs', async (_, token) => {
    const req = request(app).get('/private');
    const res = await (token ? req.set('Cookie', sessionCookie(token)) : req);

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(handlerCalls).toBe(0);
  });
});

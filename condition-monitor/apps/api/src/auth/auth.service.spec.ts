import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthConfig } from '../config/auth-config';
import { AuthService } from './auth.service';
import { hashPassword, verifyPassword } from './password';
import type { UserRecord, UsersRepository } from './users.repository';

// The real implementation, wrapped so tests can count calls.
jest.mock('./password', () => {
  const actual = jest.requireActual<typeof import('./password')>('./password');
  return { ...actual, verifyPassword: jest.fn(actual.verifyPassword) };
});

const config: AuthConfig = {
  jwtSecret: 'unit-test-secret-of-at-least-32-characters',
  sessionTtlSeconds: 3600,
  secureCookie: false,
};

describe('AuthService', () => {
  let user: UserRecord;
  let repository: { findByEmail: jest.Mock; findById: jest.Mock };
  let jwt: JwtService;
  let service: AuthService;

  beforeAll(async () => {
    user = {
      id: '0b8c5b7e-8a8b-4b7e-9d2a-1f1e2d3c4b5a',
      email: 'operator@plant.test',
      passwordHash: await hashPassword('correct horse battery'),
    };
  });

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(async (email: string) => (email === user.email ? user : null)),
      findById: jest.fn(async (id: string) =>
        id === user.id ? { id: user.id, email: user.email } : null,
      ),
    };
    jwt = new JwtService({ secret: config.jwtSecret });
    service = new AuthService(repository as unknown as UsersRepository, jwt, config);
  });

  it('returns the user and a token that expires in one hour', async () => {
    const { user: loggedIn, token } = await service.login({
      email: user.email,
      password: 'correct horse battery',
    });

    const claims = await jwt.verifyAsync<{ sub: string; email: string; iat: number; exp: number }>(
      token,
    );
    expect(loggedIn).toEqual({ id: user.id, email: user.email });
    expect(claims).toMatchObject({ sub: user.id, email: user.email });
    expect(claims.exp - claims.iat).toBe(3600);
  });

  it('rejects a wrong password and an unknown email with the same message', async () => {
    // Both attempts are awaited together: awaiting one first would leave the other's
    // rejection unhandled whenever it settled first, failing the test at random.
    const [wrongPassword, unknownEmail] = await Promise.allSettled([
      service.login({ email: user.email, password: 'wrong password' }),
      service.login({ email: 'nobody@plant.test', password: 'whatever' }),
    ]);

    for (const attempt of [wrongPassword, unknownEmail]) {
      expect(attempt).toEqual({
        status: 'rejected',
        reason: new UnauthorizedException('Invalid email or password.'),
      });
    }
  });

  it('checks a password even when the email is unknown, so timing reveals nothing', async () => {
    jest.mocked(verifyPassword).mockClear();

    await service
      .login({ email: 'nobody@plant.test', password: 'whatever' })
      .catch(() => undefined);

    expect(verifyPassword).toHaveBeenCalledTimes(1);
  });

  it('answers who the session belongs to, and refuses a user that no longer exists', async () => {
    await expect(service.me(user.id)).resolves.toEqual({ id: user.id, email: user.email });
    await expect(service.me('9f9f9f9f-0000-4000-8000-000000000000')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

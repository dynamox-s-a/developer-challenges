import { readAuthConfig } from './auth-config';

describe('readAuthConfig', () => {
  const secret32 = 'x'.repeat(32);

  it('accepts a secret of exactly 32 characters, with a one-hour session', () => {
    expect(readAuthConfig({ JWT_SECRET: secret32 })).toEqual({
      jwtSecret: secret32,
      sessionTtlSeconds: 3600,
      secureCookie: false,
    });
  });

  it('refuses to start with a missing or shorter secret', () => {
    expect(() => readAuthConfig({})).toThrow('JWT_SECRET must have at least 32 characters');
    expect(() => readAuthConfig({ JWT_SECRET: 'x'.repeat(31) })).toThrow(
      'JWT_SECRET must have at least 32 characters',
    );
  });

  it('sends the cookie only over HTTPS in production', () => {
    expect(readAuthConfig({ JWT_SECRET: secret32, NODE_ENV: 'production' }).secureCookie).toBe(
      true,
    );
  });
});

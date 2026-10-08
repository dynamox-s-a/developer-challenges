import { parseEnv } from './env';

const validEnv = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  AUTH_EMAIL: 'admin@dynapredict.com',
  AUTH_PASSWORD_HASH:
    '$2b$10$OdyYOmQp41oMSn1ArDiq8erLkv115W6DHECqimOH6S51brwLSBaCi',
  JWT_SECRET: 'a-development-secret',
};

function parseError(source: NodeJS.ProcessEnv): string {
  try {
    parseEnv(source);
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error('expected parseEnv to throw');
}

describe('parseEnv', () => {
  it('applies defaults for optional variables', () => {
    expect(parseEnv(validEnv)).toEqual({
      ...validEnv,
      NODE_ENV: 'development',
      PORT: 3333,
      CORS_ORIGIN: ['http://localhost:4200'],
      JWT_EXPIRES_IN: '8h',
    });
  });

  it('coerces PORT and splits a comma-separated CORS_ORIGIN', () => {
    const env = parseEnv({
      ...validEnv,
      PORT: '8080',
      CORS_ORIGIN: 'http://localhost:4200, https://dynapredict.vercel.app',
    });

    expect(env.PORT).toBe(8080);
    expect(env.CORS_ORIGIN).toEqual([
      'http://localhost:4200',
      'https://dynapredict.vercel.app',
    ]);
  });

  it('lists every missing required variable by name', () => {
    const message = parseError({});

    for (const name of [
      'DATABASE_URL',
      'AUTH_EMAIL',
      'AUTH_PASSWORD_HASH',
      'JWT_SECRET',
    ]) {
      expect(message).toContain(name);
    }
  });

  it('never echoes variable values in the error', () => {
    const message = parseError({
      ...validEnv,
      JWT_SECRET: 'short',
      AUTH_PASSWORD_HASH: 'plaintext-password',
    });

    expect(message).toContain('JWT_SECRET');
    expect(message).toContain('AUTH_PASSWORD_HASH');
    expect(message).not.toContain('short');
    expect(message).not.toContain('plaintext-password');
  });

  it.each([
    ['DATABASE_URL', 'mysql://user:pass@localhost/db'],
    ['AUTH_EMAIL', 'not-an-email'],
    ['AUTH_PASSWORD_HASH', 'dynapredict123'],
    ['JWT_EXPIRES_IN', 'eight hours'],
    ['CORS_ORIGIN', 'localhost:4200'],
    ['NODE_ENV', 'staging'],
  ])('rejects an invalid %s', (name, value) => {
    expect(parseError({ ...validEnv, [name]: value })).toContain(name);
  });

  describe('in production', () => {
    const production = { ...validEnv, NODE_ENV: 'production' };

    it('rejects the placeholder JWT secret', () => {
      expect(
        parseError({ ...production, JWT_SECRET: 'change-me-in-production' }),
      ).toContain('JWT_SECRET');
    });

    it('rejects a JWT secret shorter than 32 characters', () => {
      expect(parseError(production)).toContain('JWT_SECRET');
    });

    it('accepts a long random JWT secret', () => {
      const secret = 'f'.repeat(64);
      expect(parseEnv({ ...production, JWT_SECRET: secret }).JWT_SECRET).toBe(
        secret,
      );
    });
  });
});

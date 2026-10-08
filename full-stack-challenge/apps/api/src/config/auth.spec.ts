import { authCookieOptions, durationToMs } from './auth';

describe('durationToMs', () => {
  it.each([
    ['30s', 30_000],
    ['15m', 900_000],
    ['8h', 28_800_000],
    ['7d', 604_800_000],
  ])('converts %s', (duration, ms) => {
    expect(durationToMs(duration)).toBe(ms);
  });

  it('rejects an unsupported format', () => {
    expect(() => durationToMs('8 hours')).toThrow('Unsupported duration');
  });
});

describe('authCookieOptions', () => {
  it('uses SameSite=Lax without Secure outside production', () => {
    expect(
      authCookieOptions({ NODE_ENV: 'development', JWT_EXPIRES_IN: '8h' }),
    ).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 28_800_000,
    });
  });

  it('uses SameSite=None with Secure in production (cross-site web and API)', () => {
    expect(
      authCookieOptions({ NODE_ENV: 'production', JWT_EXPIRES_IN: '8h' }),
    ).toMatchObject({ httpOnly: true, secure: true, sameSite: 'none' });
  });
});

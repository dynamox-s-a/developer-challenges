import type { CookieOptions } from 'express';
import type { Env } from './env';

export const AUTH_COOKIE_NAME = 'dynapredict_token';

const UNIT_MS = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;

/** Converts a validated JWT_EXPIRES_IN value ("30m", "8h", "7d") to ms. */
export function durationToMs(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) throw new Error(`Unsupported duration: ${duration}`);
  return Number(match[1]) * UNIT_MS[match[2] as keyof typeof UNIT_MS];
}

/**
 * In production the web app (Vercel) and the API (Render) are on different
 * sites, so the cookie must be SameSite=None, which browsers only accept with
 * Secure. Locally both run on localhost, the same site, so Lax over plain HTTP
 * works (and Safari drops Secure cookies on http://localhost).
 */
export function authCookieOptions(
  env: Pick<Env, 'NODE_ENV' | 'JWT_EXPIRES_IN'>,
): CookieOptions {
  const production = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? 'none' : 'lax',
    path: '/',
    maxAge: durationToMs(env.JWT_EXPIRES_IN),
  };
}

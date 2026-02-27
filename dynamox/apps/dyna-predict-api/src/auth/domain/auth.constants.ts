/**
 * @fileoverview Authentication domain constants. Centralizes all magic numbers
 * and strings related to auth to ensure consistency across the domain.
 */

import type { HTTPMethods } from 'fastify';

export const LOGIN_RATE_LIMIT = {
  MAX: 5,
  TIME_WINDOW: '15m',
} as const;

export const JWT_EXPIRATION = '2d';

export const COOKIE_MAX_AGE = 2 * 24 * 60 * 60;

export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: COOKIE_MAX_AGE,
} as const;

export const ACCEPTED_CORS_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS',
  'PATCH',
] as const satisfies HTTPMethods[];

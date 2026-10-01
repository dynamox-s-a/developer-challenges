import type { SessionUser } from '@condition-monitor/shared';
import type { Request } from 'express';

/** Name of the session cookie, sent only to `/api` routes. */
export const SESSION_COOKIE = 'session';
export const SESSION_COOKIE_PATH = '/api';

/** Claims inside the session token: the user id as subject, and the email. */
export interface SessionClaims {
  sub: string;
  email: string;
}

/** A request that passed the session guard carries its user. */
export interface AuthenticatedRequest extends Request {
  user: SessionUser;
}

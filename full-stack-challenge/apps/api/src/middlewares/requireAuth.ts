import type { RequestHandler } from 'express';
import { AUTH_COOKIE_NAME } from '../config/auth';
import { type AuthUser, verifyToken } from '../modules/auth/auth.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      /** Set by requireAuth; present in every handler mounted after it. */
      user?: AuthUser;
    }
  }
}

/**
 * Rejects the request with 401 unless it carries a valid session cookie, and
 * exposes the user as res.locals.user. Mount it per private router, e.g.
 * `api.use('/machines', requireAuth, machinesRoutes)`, so unknown paths still 404.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  res.locals.user = verifyToken(req.cookies?.[AUTH_COOKIE_NAME]);
  next();
};

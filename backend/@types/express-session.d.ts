import * as session from 'express-session';

/**
 * Augments the Express Request object with a session property.
 * This declaration extends the default Express Request object to include
 * a session object, which holds the session data for the request.
 */
declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

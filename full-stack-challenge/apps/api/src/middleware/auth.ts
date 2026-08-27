import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../shared/errors';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = header.slice('Bearer '.length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError(500, 'JWT secret is not configured'));
  }

  try {
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}

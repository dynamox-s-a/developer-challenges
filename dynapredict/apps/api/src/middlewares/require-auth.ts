import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';
import { verifyToken } from '../lib/jwt.ts';

// "Porteiro": só deixa passar requisições com um token válido no cabeçalho Authorization
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization; // esperado: "Bearer eyJhbGciOi..."

  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token de acesso ausente');
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyToken(token);
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Token inválido ou expirado');
  }

  next();
};
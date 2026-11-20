import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';

// Nenhuma rota respondeu: 404 em JSON, no mesmo formato dos outros erros
export const notFoundHandler: RequestHandler = (req) => {
  throw new AppError(
    404,
    'NOT_FOUND',
    `Rota não encontrada: ${req.method} ${req.path}`,
  );
};
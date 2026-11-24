import type { RequestHandler } from 'express';
import { z } from 'zod';
import { AppError } from '../errors/app-error.ts';

// Recebe um schema do zod e devolve um middleware que valida o req.body
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Dados inválidos',
        z.flattenError(result.error),
      );
    }

    // Troca o body pelos dados já validados (ex.: com espaços removidos pelo .trim())
    req.body = result.data;
    next();
  };
}

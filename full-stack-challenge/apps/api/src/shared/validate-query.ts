import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errors';

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );
      return next(new AppError(400, 'Validation failed', errors));
    }
    (req as Request & { validatedQuery: T }).validatedQuery = result.data;
    return next();
  };
}

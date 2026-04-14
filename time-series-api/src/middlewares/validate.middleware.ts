import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

type RequestSegment = 'body' | 'params';

export function validate(
  schema: z.ZodTypeAny,
  segment: RequestSegment = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[segment]);

    if (!result.success) {
      next(result.error);
      return;
    }

    req[segment] = result.data;
    next();
  };
}
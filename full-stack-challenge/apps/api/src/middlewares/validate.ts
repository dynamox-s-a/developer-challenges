import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export type RequestSource = 'body' | 'query' | 'params';

/**
 * Parses `req[source]` with `schema` and replaces it with the parsed output, so
 * handlers receive coerced values and defaults (e.g. `page: "2"` -> `2`) and
 * unknown keys are stripped. A failure goes to the errorHandler as a ZodError
 * (400). Chain one call per source when a route validates more than one.
 */
export function validate(
  schema: ZodType,
  source: RequestSource = 'body',
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }

    // Express 5 exposes req.query as a getter, so plain assignment throws.
    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
}

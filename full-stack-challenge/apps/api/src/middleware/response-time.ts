import { NextFunction, Request, Response } from 'express';

/** Adds X-Response-Time so clients can verify the <350ms latency target. */
export function responseTimeMiddleware(_req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  const originalEnd = res.end.bind(res);
  res.end = ((...args: unknown[]) => {
    if (!res.headersSent) {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    }
    return (originalEnd as (...a: unknown[]) => unknown)(...args);
  }) as typeof res.end;

  next();
}

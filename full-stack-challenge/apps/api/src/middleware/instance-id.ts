import { NextFunction, Request, Response } from 'express';

/** Identifies which API replica served the request (useful behind a load balancer). */
export function instanceIdMiddleware(_req: Request, res: Response, next: NextFunction) {
  const instanceId =
    process.env.INSTANCE_ID ||
    process.env.HOSTNAME ||
    `pid-${process.pid}`;

  res.setHeader('X-Instance-Id', instanceId);
  next();
}

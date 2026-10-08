import type { Request, Response } from 'express';
import * as healthService from './health.service';

export async function check(_req: Request, res: Response) {
  const dbUp = await healthService.isDatabaseUp();
  // Probes must always see the current state, never a cached one.
  res.set('Cache-Control', 'no-store');
  if (dbUp) {
    res.json({ status: 'ok', db: 'up' });
  } else {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
}

import { Router } from 'express';
import { prisma } from '../../lib/prisma.ts';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ api: 'ok', database: 'ok' });
  } catch {
    res.status(503).json({ api: 'ok', database: 'error' });
  }
});

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { responseTimeMiddleware } from './middleware/response-time';
import { instanceIdMiddleware } from './middleware/instance-id';
import { authRouter } from './modules/auth/auth.routes';
import { machinesRouter } from './modules/machines/machines.routes';
import {
  machineMonitoringPointsRouter,
  monitoringPointsRouter,
} from './modules/monitoring-points/monitoring-points.routes';
import {
  globalReadingsRouter,
  timeSeriesRouter,
} from './modules/time-series/time-series.routes';
import { AppError } from './shared/errors';

export function createApp() {
  const app = express();

  app.use(responseTimeMiddleware);
  app.use(instanceIdMiddleware);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
      credentials: true,
      exposedHeaders: ['X-Response-Time', 'X-Instance-Id'],
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/machines/:machineId/monitoring-points', machineMonitoringPointsRouter);
  app.use('/api/machines', machinesRouter);
  app.use('/api/monitoring-points/:id/readings', timeSeriesRouter);
  app.use('/api/monitoring-points', monitoringPointsRouter);
  app.use('/api/readings', globalReadingsRouter);

  app.use((_req, res) => {
    res.status(404).json({ statusCode: 404, message: 'Route not found' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
        errors: err.errors,
      });
    }

    console.error(err);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  });

  return app;
}

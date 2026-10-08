import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { AppError } from './errors/AppError';
import { errorHandler } from './middlewares/errorHandler';
import { requireAuth } from './middlewares/requireAuth';
import { authRoutes } from './modules/auth/auth.routes';
import { healthRoutes } from './modules/health/health.routes';
import { machinesRoutes } from './modules/machines/machines.routes';
import {
  machineMonitoringPointsRoutes,
  monitoringPointsRoutes,
} from './modules/monitoring-points/monitoring-points.routes';
import { sensorReadingsRoutes } from './modules/readings/readings.routes';
import {
  pointSensorRoutes,
  sensorsRoutes,
} from './modules/sensors/sensors.routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // credentials: true lets the browser send the auth cookie cross-origin; it
  // requires an explicit origin list, never "*".
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  // A full readings batch (MAX_READINGS_PER_REQUEST) is ~60kb; the default
  // 100kb limit leaves too little headroom for long numbers.
  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());

  const api = express.Router();
  api.use('/health', healthRoutes);
  api.use('/auth', authRoutes);
  // Private routers: requireAuth per router keeps unknown paths a 404.
  api.use(
    '/machines/:machineId/monitoring-points',
    requireAuth,
    machineMonitoringPointsRoutes,
  );
  api.use('/machines', requireAuth, machinesRoutes);
  api.use('/monitoring-points/:pointId/sensor', requireAuth, pointSensorRoutes);
  api.use('/monitoring-points', requireAuth, monitoringPointsRoutes);
  api.use('/sensors/:sensorId/readings', requireAuth, sensorReadingsRoutes);
  api.use('/sensors', requireAuth, sensorsRoutes);
  app.use('/api/v1', api);

  app.use((req) => {
    throw AppError.notFound(`Route ${req.method} ${req.path} not found`);
  });
  app.use(errorHandler);

  return app;
}

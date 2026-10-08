import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import * as readingsController from './readings.controller';
import {
  timeRangeQuery,
  createReadingsSchema,
  listReadingsQuery,
  predictionQuery,
  sensorIdParams,
} from './readings.schemas';

/** Mounted at /sensors/:sensorId/readings (needs the parent param). */
export const sensorReadingsRoutes = Router({ mergeParams: true });

sensorReadingsRoutes.get(
  '/',
  validate(sensorIdParams, 'params'),
  validate(listReadingsQuery, 'query'),
  readingsController.list,
);
sensorReadingsRoutes.get(
  '/count',
  validate(sensorIdParams, 'params'),
  validate(timeRangeQuery, 'query'),
  readingsController.count,
);
sensorReadingsRoutes.get(
  '/metrics',
  validate(sensorIdParams, 'params'),
  validate(timeRangeQuery, 'query'),
  readingsController.metrics,
);
sensorReadingsRoutes.get(
  '/prediction',
  validate(sensorIdParams, 'params'),
  validate(predictionQuery, 'query'),
  readingsController.predict,
);
sensorReadingsRoutes.post(
  '/',
  validate(sensorIdParams, 'params'),
  validate(createReadingsSchema),
  readingsController.create,
);
sensorReadingsRoutes.delete(
  '/',
  validate(sensorIdParams, 'params'),
  validate(timeRangeQuery, 'query'),
  readingsController.remove,
);

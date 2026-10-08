import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import * as sensorsController from './sensors.controller';
import {
  attachSensorSchema,
  pointIdParams,
  sensorIdParams,
} from './sensors.schemas';

/** Mounted at /sensors. */
export const sensorsRoutes = Router();

sensorsRoutes.delete(
  '/:id',
  validate(sensorIdParams, 'params'),
  sensorsController.remove,
);

/** Mounted at /monitoring-points/:pointId/sensor (needs the parent param). */
export const pointSensorRoutes = Router({ mergeParams: true });

pointSensorRoutes.post(
  '/',
  validate(pointIdParams, 'params'),
  validate(attachSensorSchema),
  sensorsController.attach,
);

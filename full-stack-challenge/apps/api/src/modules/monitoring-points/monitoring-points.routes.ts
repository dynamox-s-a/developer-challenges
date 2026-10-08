import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import * as monitoringPointsController from './monitoring-points.controller';
import {
  listMonitoringPointsQuery,
  machineIdParams,
  monitoringPointIdParams,
  monitoringPointInputSchema,
} from './monitoring-points.schemas';

/** Mounted at /monitoring-points. */
export const monitoringPointsRoutes = Router();

monitoringPointsRoutes.get(
  '/',
  validate(listMonitoringPointsQuery, 'query'),
  monitoringPointsController.list,
);
monitoringPointsRoutes.get(
  '/:id',
  validate(monitoringPointIdParams, 'params'),
  monitoringPointsController.get,
);
monitoringPointsRoutes.put(
  '/:id',
  validate(monitoringPointIdParams, 'params'),
  validate(monitoringPointInputSchema),
  monitoringPointsController.update,
);
monitoringPointsRoutes.delete(
  '/:id',
  validate(monitoringPointIdParams, 'params'),
  monitoringPointsController.remove,
);

/** Mounted at /machines/:machineId/monitoring-points (needs the parent param). */
export const machineMonitoringPointsRoutes = Router({ mergeParams: true });

machineMonitoringPointsRoutes.post(
  '/',
  validate(machineIdParams, 'params'),
  validate(monitoringPointInputSchema),
  monitoringPointsController.create,
);

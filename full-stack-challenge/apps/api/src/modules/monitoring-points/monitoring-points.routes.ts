import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../shared/validate';
import { validateQuery } from '../../shared/validate-query';
import {
  associateSensorSchema,
  createMonitoringPointSchema,
  listMonitoringPointsQuerySchema,
} from './monitoring-points.schemas';
import * as monitoringPointsService from './monitoring-points.service';
import type { ListMonitoringPointsQuery } from './monitoring-points.schemas';

export const monitoringPointsRouter = Router();

monitoringPointsRouter.use(requireAuth);

monitoringPointsRouter.get(
  '/',
  validateQuery(listMonitoringPointsQuerySchema),
  async (req, res, next) => {
    try {
      const query = (req as typeof req & { validatedQuery: ListMonitoringPointsQuery })
        .validatedQuery;
      const result = await monitoringPointsService.listMonitoringPoints(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

monitoringPointsRouter.get('/:id', async (req, res, next) => {
  try {
    const point = await monitoringPointsService.getMonitoringPoint(req.params.id);
    res.json(point);
  } catch (error) {
    next(error);
  }
});

monitoringPointsRouter.delete('/:id', async (req, res, next) => {
  try {
    await monitoringPointsService.deleteMonitoringPoint(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

monitoringPointsRouter.post(
  '/:id/sensor',
  validateBody(associateSensorSchema),
  async (req, res, next) => {
    try {
      const point = await monitoringPointsService.associateSensor(req.params.id, req.body);
      res.status(201).json(point);
    } catch (error) {
      next(error);
    }
  }
);

monitoringPointsRouter.delete('/:id/sensor', async (req, res, next) => {
  try {
    await monitoringPointsService.removeSensor(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/** Nested under /api/machines/:machineId/monitoring-points */
export const machineMonitoringPointsRouter = Router({ mergeParams: true });

machineMonitoringPointsRouter.use(requireAuth);

machineMonitoringPointsRouter.get('/', async (req, res, next) => {
  try {
    const points = await monitoringPointsService.listMonitoringPointsByMachine(
      req.params.machineId
    );
    res.json(points);
  } catch (error) {
    next(error);
  }
});

machineMonitoringPointsRouter.post(
  '/',
  validateBody(createMonitoringPointSchema),
  async (req, res, next) => {
    try {
      const point = await monitoringPointsService.createMonitoringPoint(
        req.params.machineId,
        req.body
      );
      res.status(201).json(point);
    } catch (error) {
      next(error);
    }
  }
);

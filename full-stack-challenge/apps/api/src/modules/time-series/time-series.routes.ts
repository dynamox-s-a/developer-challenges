import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../shared/validate';
import { validateQuery } from '../../shared/validate-query';
import {
  createReadingsSchema,
  forecastQuerySchema,
  readingsRangeQuerySchema,
  type ForecastQuery,
  type ReadingsRangeQuery,
} from './time-series.schemas';
import * as timeSeriesService from './time-series.service';

export const timeSeriesRouter = Router({ mergeParams: true });

timeSeriesRouter.use(requireAuth);

timeSeriesRouter.post('/', validateBody(createReadingsSchema), async (req, res, next) => {
  try {
    const result = await timeSeriesService.storeReadings(req.params.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

timeSeriesRouter.get(
  '/metrics',
  validateQuery(readingsRangeQuerySchema),
  async (req, res, next) => {
    try {
      const range = (req as typeof req & { validatedQuery: ReadingsRangeQuery }).validatedQuery;
      const metrics = await timeSeriesService.getMetrics(req.params.id, range);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
);

timeSeriesRouter.get(
  '/count',
  validateQuery(readingsRangeQuerySchema),
  async (req, res, next) => {
    try {
      const range = (req as typeof req & { validatedQuery: ReadingsRangeQuery }).validatedQuery;
      const result = await timeSeriesService.getPointReadingsCount(req.params.id, range);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

timeSeriesRouter.get(
  '/forecast',
  validateQuery(forecastQuerySchema),
  async (req, res, next) => {
    try {
      const query = (req as typeof req & { validatedQuery: ForecastQuery }).validatedQuery;
      const forecast = await timeSeriesService.forecastReadings(req.params.id, query);
      res.json(forecast);
    } catch (error) {
      next(error);
    }
  }
);

timeSeriesRouter.get('/', validateQuery(readingsRangeQuerySchema), async (req, res, next) => {
  try {
    const range = (req as typeof req & { validatedQuery: ReadingsRangeQuery }).validatedQuery;
    const readings = await timeSeriesService.listReadings(req.params.id, range);
    res.json(readings);
  } catch (error) {
    next(error);
  }
});

timeSeriesRouter.delete('/', validateQuery(readingsRangeQuerySchema), async (req, res, next) => {
  try {
    const range = (req as typeof req & { validatedQuery: ReadingsRangeQuery }).validatedQuery;
    const result = await timeSeriesService.deleteReadings(req.params.id, range);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const globalReadingsRouter = Router();

globalReadingsRouter.use(requireAuth);

globalReadingsRouter.get('/count', async (_req, res, next) => {
  try {
    const result = await timeSeriesService.getGlobalReadingsCount();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

import { Router } from 'express';
import {
  countTimeSeries,
  createTimeSeries,
  deleteTimeSeriesById,
  getTimeSeriesById,
  getTimeSeriesMetrics,
} from '../controllers/timeSeries.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createTimeSeriesSchema,
  timeSeriesIdParamsSchema,
} from '../schemas/timeSeries.schema';

const timeSeriesRouter = Router();

timeSeriesRouter.post('/', validate(createTimeSeriesSchema), createTimeSeries);
timeSeriesRouter.get('/count', countTimeSeries);
timeSeriesRouter.get('/:id/metrics', validate(timeSeriesIdParamsSchema, 'params'), getTimeSeriesMetrics);
timeSeriesRouter.get('/:id', validate(timeSeriesIdParamsSchema, 'params'), getTimeSeriesById);
timeSeriesRouter.delete('/:id', validate(timeSeriesIdParamsSchema, 'params'), deleteTimeSeriesById);

export { timeSeriesRouter };
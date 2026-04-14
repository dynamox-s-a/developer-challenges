import { NextFunction, Request, Response } from 'express';
import {
  CreateTimeSeriesInput,
  TimeSeriesIdParamsInput,
} from '../schemas/timeSeries.schema';
import { timeSeriesService } from '../services/timeSeries.service';
import {
  toCountResponse,
  toTimeSeriesCreationResponse,
  toTimeSeriesMetricsResponse,
  toTimeSeriesResponse,
} from '../mappers/timeSeries.mapper';

type CreateTimeSeriesRequest = Request<{}, {}, CreateTimeSeriesInput>;
type TimeSeriesByIdRequest = Request<TimeSeriesIdParamsInput>;

export async function createTimeSeries(
  req: CreateTimeSeriesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const timeSeries = await timeSeriesService.create(req.body);
    res.status(201).json(toTimeSeriesCreationResponse(timeSeries));
  } catch (error) {
    next(error);
  }
}

export async function getTimeSeriesById(
  req: TimeSeriesByIdRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const timeSeries = await timeSeriesService.getById(req.params.id);
    res.status(200).json(toTimeSeriesResponse(timeSeries));
  } catch (error) {
    next(error);
  }
}

export async function getTimeSeriesMetrics(
  req: TimeSeriesByIdRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const metrics = await timeSeriesService.getMetricsById(req.params.id);
    res.status(200).json(toTimeSeriesMetricsResponse(metrics));
  } catch (error) {
    next(error);
  }
}

export async function countTimeSeries(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const count = await timeSeriesService.count();
    res.status(200).json(toCountResponse(count));
  } catch (error) {
    next(error);
  }
}

export async function deleteTimeSeriesById(
  req: TimeSeriesByIdRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await timeSeriesService.deleteById(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
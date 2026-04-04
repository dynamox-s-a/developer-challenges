import { Request, Response } from "express";
import {
  toCountResponse,
  toTimeSeriesMetricsResponse,
  toTimeSeriesResponse,
} from "../dto/time-series.dto.js";
import * as service from "../services/time-series.service.js";

export async function create(req: Request, res: Response) {
  const series = await service.createTimeSeries(req.body);
  return res.status(201).json(toTimeSeriesResponse(series));
}

export async function count(req: Request, res: Response) {
  const total = await service.countTimeSeries();
  return res.status(200).json(toCountResponse(total));
}

export async function getById(req: Request, res: Response) {
  const { seriesId } = req.params as { seriesId: string };
  const series = await service.getBySeriesId(seriesId);
  return res.status(200).json(toTimeSeriesResponse(series));
}

export async function getMetrics(req: Request, res: Response) {
  const { seriesId } = req.params as { seriesId: string };
  const metrics = await service.getMetricsBySeriesId(seriesId);
  return res.status(200).json(toTimeSeriesMetricsResponse(metrics));
}

export async function remove(req: Request, res: Response) {
  const { seriesId } = req.params as { seriesId: string };
  await service.deleteBySeriesId(seriesId);
  return res.sendStatus(204);
}

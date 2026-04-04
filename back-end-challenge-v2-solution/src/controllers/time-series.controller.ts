import { Request, Response } from "express";
import * as service from "../services/time-series.service.js";

export async function create(req: Request, res: Response) {
  const series = await service.createTimeSeries(req.body);
  return res.status(201).json(series);
}

export async function count(req: Request, res: Response) {
  const total = await service.countTimeSeries();
  return res.status(200).json({ total });
}

export async function getById(req: Request, res: Response) {
  const { seriesId } = req.params as { seriesId: string };
  const series = await service.getBySeriesId(seriesId);
  return res.status(200).json(series);
}

export async function remove(req: Request, res: Response) {
  const { seriesId } = req.params as { seriesId: string };
  await service.deleteBySeriesId(seriesId);
  return res.sendStatus(204);
}

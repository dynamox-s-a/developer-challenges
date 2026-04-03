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

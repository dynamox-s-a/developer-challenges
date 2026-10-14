import type { Request, Response } from "express";
import {
  createReadingsSchema,
  readingsMetricsQuerySchema,
  readingsRangeQuerySchema,
} from "@full-stack-solution/shared";
import { getIdParam } from "../../shared/http/request";
import { getUserId } from "../auth/auth.middleware";
import type { TimeSeriesService } from "./time-series.service";

export class TimeSeriesController {
  constructor(private readonly service: TimeSeriesService) {}

  insert = async (req: Request, res: Response): Promise<void> => {
    const input = createReadingsSchema.parse(req.body);
    res.status(201).json(
      await this.service.insert(getIdParam(req), getUserId(req), input),
    );
  };

  getReadings = async (req: Request, res: Response): Promise<void> => {
    const query = readingsRangeQuerySchema.parse(req.query);
    res.json(
      await this.service.getReadings(getIdParam(req), getUserId(req), query),
    );
  };

  getMetrics = async (req: Request, res: Response): Promise<void> => {
    // `metric` is required here: see readingsMetricsQuerySchema.
    const query = readingsMetricsQuerySchema.parse(req.query);
    res.json(
      await this.service.getMetrics(getIdParam(req), getUserId(req), query),
    );
  };

  countByUser = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.countByUser(getUserId(req)));
  };

  deleteReadings = async (req: Request, res: Response): Promise<void> => {
    const query = readingsRangeQuerySchema.parse(req.query);
    res.json(
      await this.service.deleteReadings(
        getIdParam(req),
        getUserId(req),
        query,
      ),
    );
  };
}

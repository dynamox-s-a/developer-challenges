import type { Request, Response } from "express";
import {
  assignSensorSchema,
  createMonitoringPointSchema,
  listMonitoringPointsQuerySchema,
  updateMonitoringPointSchema,
} from "@full-stack-solution/shared";
import { getIdParam } from "../../shared/http/request";
import { getUserId } from "../auth/auth.middleware";
import type { MonitoringPointsService } from "./monitoring-points.service";

export class MonitoringPointsController {
  constructor(private readonly service: MonitoringPointsService) {}

  createForMachine = async (req: Request, res: Response): Promise<void> => {
    const input = createMonitoringPointSchema.parse(req.body);
    const point = await this.service.createForMachine(
      getIdParam(req),
      getUserId(req),
      input,
    );
    res.status(201).json(point);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = listMonitoringPointsQuerySchema.parse(req.query);
    res.json(await this.service.list(getUserId(req), query));
  };

  rename = async (req: Request, res: Response): Promise<void> => {
    const input = updateMonitoringPointSchema.parse(req.body);
    res.json(await this.service.rename(getIdParam(req), getUserId(req), input));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(getIdParam(req), getUserId(req));
    res.status(204).end();
  };

  assignSensor = async (req: Request, res: Response): Promise<void> => {
    const input = assignSensorSchema.parse(req.body);
    res.json(
      await this.service.assignSensor(getIdParam(req), getUserId(req), input),
    );
  };

  removeSensor = async (req: Request, res: Response): Promise<void> => {
    await this.service.removeSensor(getIdParam(req), getUserId(req));
    res.status(204).end();
  };
}

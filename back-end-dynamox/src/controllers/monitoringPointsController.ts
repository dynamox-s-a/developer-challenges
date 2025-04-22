import { Request, Response } from "express";
import MonitoringPointService from "../services/monitoringPointService";

class MonitoringPointController {
  static async create(req: Request, res: Response) {
    const { machineId, name, sensor } = req.body;

    try {
      const newMonitoringPoint = await MonitoringPointService.createMonitoringPoint(
        machineId,
        name,
        sensor
      );
      res.status(201).json(newMonitoringPoint);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message || "Failed to create monitoring point" });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  static async listPaginated(req: Request, res: Response) {
    const { page = "1", sortBy = "name", order = "asc" } = req.query;

    try {
      const result = await MonitoringPointService.listPaginated(page as string, sortBy as string, order as string);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message || "Failed to fetch monitoring points" });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
}

export default MonitoringPointController;

import { Request, Response } from "express";
import { MonitoringPoint } from "../models/MonitoringPoint";
import { Machine } from "../models/Machine";
import { VALID_SENSOR_MODELS } from "../utils/constants";

class MonitoringPointController {
  static async create(req: Request, res: Response) {
    const { machineId, name, sensor } = req.body;

    if (!VALID_SENSOR_MODELS.includes(sensor.model)) {
      return res.status(400).json({ error: "Invalid sensor model" });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) return res.status(404).json({ error: "Machine not found" });

    if (
      machine.type === "Pump" &&
      (sensor.model === "TcAg" || sensor.model === "TcAs")
    ) {
      return res
        .status(400)
        .json({
          error: `Sensor model "${sensor.model}" is not allowed for Pump`,
        });
    }

    try {
      const newMonitoringPoint = new MonitoringPoint({
        machineId,
        name,
        sensor,
      });
      await newMonitoringPoint.save();
      res.status(201).json(newMonitoringPoint);
    } catch (err) {
      res.status(500).json({ error: "Failed to create monitoring point" });
    }
  }

  static async listPaginated(req: Request, res: Response) {
    const { page = "1", sortBy = "name", order = "asc" } = req.query;
  
    const limit = 5;
    const pageNumber = parseInt(page as string, 10);
    const skip = (pageNumber - 1) * limit;
    const sortField = sortBy as string;
    const sortOrder = order === "desc" ? -1 : 1;
  
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: "machines",
            localField: "machineId",
            foreignField: "_id",
            as: "machine",
          },
        },
        {
          $unwind: "$machine",
        },
        {
          $addFields: {
            machineId: "$machine", 
          },
        },
        {
          $project: {
            machine: 0, 
          },
        },
        {
          $sort: {
            [sortField]: sortOrder,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];
  
      const countPipeline = [
        {
          $lookup: {
            from: "machines",
            localField: "machineId",
            foreignField: "_id",
            as: "machine",
          },
        },
        { $unwind: "$machine" },
        { $count: "total" },
      ];
  
      const [points, totalResult] = await Promise.all([
        MonitoringPoint.aggregate(pipeline),
        MonitoringPoint.aggregate(countPipeline),
      ]);
  
      const total = totalResult[0]?.total || 0;
  
      res.json({ data: points, total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch monitoring points" });
    }
  }
}

export default MonitoringPointController;

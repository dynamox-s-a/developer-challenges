import { MonitoringPoint } from '../models/MonitoringPoint';
import { Machine } from '../models/Machine';
import { VALID_SENSOR_MODELS } from '../utils/constants';

class MonitoringPointService {
  static async createMonitoringPoint(machineId: string, name: string, sensor: any) {
    if (!VALID_SENSOR_MODELS.includes(sensor.model)) {
      throw new Error("Invalid sensor model");
    }

    const machine = await Machine.findById(machineId);
    if (!machine) throw new Error("Machine not found");

    if (
      machine.type === "Pump" &&
      (sensor.model === "TcAg" || sensor.model === "TcAs")
    ) {
      throw new Error(`Sensor model "${sensor.model}" is not allowed for Pump`);
    }

    const newMonitoringPoint = new MonitoringPoint({
      machineId,
      name,
      sensor,
    });
    await newMonitoringPoint.save();
    return newMonitoringPoint;
  }

  static async listPaginated(page: string, sortBy: string, order: string) {
    const limit = 5;
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * limit;
    const sortField = sortBy;
    const sortOrder = order === "desc" ? -1 : 1;

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
    return { data: points, total };
  }
}

export default MonitoringPointService;

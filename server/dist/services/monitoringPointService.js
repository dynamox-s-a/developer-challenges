"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MonitoringPoint_1 = require("../models/MonitoringPoint");
const Machine_1 = require("../models/Machine");
const constants_1 = require("../utils/constants");
class MonitoringPointService {
    static async createMonitoringPoint(machineId, name, sensor) {
        if (!constants_1.VALID_SENSOR_MODELS.includes(sensor.model)) {
            throw new Error("Invalid sensor model");
        }
        const machine = await Machine_1.Machine.findById(machineId);
        if (!machine)
            throw new Error("Machine not found");
        if (machine.type === "Pump" &&
            (sensor.model === "TcAg" || sensor.model === "TcAs")) {
            throw new Error(`Sensor model "${sensor.model}" is not allowed for Pump`);
        }
        const newMonitoringPoint = new MonitoringPoint_1.MonitoringPoint({
            machineId,
            name,
            sensor,
        });
        await newMonitoringPoint.save();
        return newMonitoringPoint;
    }
    static async listPaginated(page, sortBy, order) {
        const limit = 5;
        const pageNumber = parseInt(page, 10);
        const skip = (pageNumber - 1) * limit;
        const sortField = sortBy;
        const sortOrder = order === "desc" ? -1 : 1;
        const pipeline = [
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
            MonitoringPoint_1.MonitoringPoint.aggregate(pipeline),
            MonitoringPoint_1.MonitoringPoint.aggregate(countPipeline),
        ]);
        const total = totalResult[0]?.total || 0;
        return { data: points, total };
    }
}
exports.default = MonitoringPointService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const monitoringPointService_1 = __importDefault(require("../services/monitoringPointService"));
class MonitoringPointController {
    static async create(req, res) {
        const { machineId, name, sensor } = req.body;
        try {
            const newMonitoringPoint = await monitoringPointService_1.default.createMonitoringPoint(machineId, name, sensor);
            res.status(201).json(newMonitoringPoint);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message || "Failed to create monitoring point" });
            }
            else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
    static async listPaginated(req, res) {
        const { page = "1", sortBy = "name", order = "asc" } = req.query;
        try {
            const result = await monitoringPointService_1.default.listPaginated(page, sortBy, order);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message || "Failed to fetch monitoring points" });
            }
            else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
}
exports.default = MonitoringPointController;

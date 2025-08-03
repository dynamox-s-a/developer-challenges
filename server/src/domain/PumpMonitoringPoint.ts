import { PumpMonitoringSensorType } from "../types/types.js";
import { BaseMonitoringPoint } from "./BaseMonitoringPoint.js";

export class PumpMonitoringPoint extends BaseMonitoringPoint {
    private constructor(userId: string, machineId: string, name: string, sensorType: PumpMonitoringSensorType, sensorId: string) {
        super(userId, machineId, name, sensorType, sensorId);
    }

    static create(userId: string, machineId: string, name: string, sensorType: PumpMonitoringSensorType): PumpMonitoringPoint {
        return new PumpMonitoringPoint(userId, machineId, name, sensorType, this.generateId());
    }
} 
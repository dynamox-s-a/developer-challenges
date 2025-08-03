import { FanMonitoringSensorType, SensorType } from "../types/types.js";
import { BaseMonitoringPoint } from "./BaseMonitoringPoint.js";

export class FanMonitoringPoint extends BaseMonitoringPoint {
    private constructor(userId: string, machineId: string, name: string, sensorType: FanMonitoringSensorType, sensorId: string) {
        super(userId, machineId, name, sensorType, sensorId);
    }

    static create(userId: string, machineId: string, name: string, sensorType: FanMonitoringSensorType): FanMonitoringPoint {
        return new FanMonitoringPoint(userId, machineId, name, sensorType, this.generateId());
    }
} 
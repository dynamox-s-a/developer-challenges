import { FanMonitoringSensorType, SensorType } from "../types/types.js";
import { BaseMonitoringPoint } from "./BaseMonitoringPoint.js";

export class FanMonitoringPoint extends BaseMonitoringPoint {
    private constructor(name: string, sensorType: FanMonitoringSensorType, sensorId: string) {
        super(name, sensorType, sensorId);
    }

    static create(name: string, sensorType: FanMonitoringSensorType): FanMonitoringPoint {
        return new FanMonitoringPoint(name, sensorType, this.generateId());
    }
} 
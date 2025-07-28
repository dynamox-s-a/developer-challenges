import { PumpMonitoringSensorType } from "./types.js";
import { BaseMonitoringPoint } from "./BaseMonitoringPoint.js";

export class PumpMonitoringPoint extends BaseMonitoringPoint {
    private constructor(name: string, sensorType: PumpMonitoringSensorType, sensorId: string) {
        super(name, sensorType, sensorId);
    }

    static create(name: string, sensorType: PumpMonitoringSensorType): PumpMonitoringPoint {
        return new PumpMonitoringPoint(name, sensorType, this.generateId());
    }
} 
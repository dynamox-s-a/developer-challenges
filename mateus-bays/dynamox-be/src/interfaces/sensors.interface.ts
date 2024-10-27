import { MonitoringPoint, Sensor } from "@prisma/client";

export interface SensorWithRelation extends Sensor{
    monitoringPoint: MonitoringPoint | null;
}
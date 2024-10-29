import { Machine, MonitoringPoint, Sensor } from "@prisma/client";

export interface MonitoringPointWithRelations extends MonitoringPoint {
    machine: Machine;
    sensor: Sensor | null; 
}
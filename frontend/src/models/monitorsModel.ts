import { SensorData } from "./sensorModel";

export interface MonitorsData {
    sensors: SensorData
    monitoring_point_id: number
    machine_id: number
    monitoring_point_name: string
    createdAt: string;
    updatedAt: string;
}
import { SensorModelType } from "../sensors/sensorTypes";

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  sensorId: string;
  machine: {
    id: string;
    name: string;
    type: string;
  };
  sensorModel: SensorModelType;
}

export interface UpdateMonitoringPointDTO {
  id: string;
  name: string;
  machineId: string;
  sensorModel: string;
}

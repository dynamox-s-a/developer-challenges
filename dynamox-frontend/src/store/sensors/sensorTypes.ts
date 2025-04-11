import { MonitoringPoint } from "../monitoring-point/monitoringPointTypes";

export type SensorModelType = "TcAg" | "TcAs" | "HF_Plus";
export type DisplaySensorModel = "TcAg" | "TcAs" | "HF+";

export const toDisplayModel = (model: SensorModelType): DisplaySensorModel => {
  return model === "HF_Plus" ? "HF+" : model;
};

export const toInternalModel = (display: DisplaySensorModel): SensorModelType => {
  return display === "HF+" ? "HF_Plus" : display;
};

export interface Sensor {
  id: string;
  name: string;
  model: SensorModelType;
  monitoringPointId: string;
  monitoringPoint: MonitoringPoint;
  machineId: string;
}

export type CreateSensorDTO = Omit<Sensor, "id" | "monitoringPoint">;
export type UpdateSensorDTO = Partial<CreateSensorDTO> & { id: string };

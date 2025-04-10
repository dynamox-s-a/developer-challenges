export interface Machine {
  id: string;
  name: string;
  type: string;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  machine: Machine;
}

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
export type SensorModel = string;

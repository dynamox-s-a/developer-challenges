export interface Machine {
  id: number;
  name: string;
  type: string;
}

export interface MonitoringPoint {
  id: number;
  name: string;
  machine: Machine;
}

export interface Sensor {
  id: number;
  name: string;
  model: "TcAg" | "TcAs" | "HF_Plus";
  monitoringPointId: number;
  monitoringPoint: MonitoringPoint;
  machineId: number;
}

export type CreateSensorDTO = Omit<Sensor, "id" | "monitoringPoint">;
export type UpdateSensorDTO = Partial<CreateSensorDTO> & { id: number };

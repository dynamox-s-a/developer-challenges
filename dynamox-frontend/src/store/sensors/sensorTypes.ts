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

export interface Sensor {
  id: string;
  name: string;
  model: "TcAg" | "TcAs" | "HF_Plus";
  monitoringPointId: string;
  monitoringPoint: MonitoringPoint;
  machineId: string;
}

export type CreateSensorDTO = Omit<Sensor, "id" | "monitoringPoint">;
export type UpdateSensorDTO = Partial<CreateSensorDTO> & { id: string };

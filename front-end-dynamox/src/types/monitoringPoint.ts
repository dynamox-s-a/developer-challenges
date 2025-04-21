
export interface Machine {
  _id: string;
  name: string;
  type: "Pump" | "Fan";
}

export interface Sensor {
  model: "TcAg" | "TcAs" | "HF+";
  serialNumber: string;
}

export interface MonitoringPoint {
  _id: string;
  name: string;
  sensor: Sensor;
  machineId: Machine;
}

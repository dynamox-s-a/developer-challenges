export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  sensorId: string;
  machine: {
    id: string;
    name: string;
    type: "Pump" | "Fan";
  };
  sensor: {
    id: string;
    model: "TcAg" | "TcAs" | "HF+";
  };
}

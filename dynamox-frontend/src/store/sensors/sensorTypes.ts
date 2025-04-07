export interface Sensor {
  id: number;
  name: string;
  model: "TcAg" | "TcAs" | "HF_Plus";
  machineId: number;
  monitoringPointId: number;
}

import Machine from "./machine";
import Sensor from "./sensor";

export default interface MonitoringPointDashboard {
  id: number | null;
  name: string;
  sensorId: number | null;
  machineId: number | null;
  machine: Machine | null;
  sensor: Sensor | null;
}

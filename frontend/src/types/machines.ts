import { MonitoringPoint } from "./monitoringPoint";

/** Machine type representing a piece of equipment. */
export interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: MonitoringPoint[];
}

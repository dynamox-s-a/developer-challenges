/** Machine type representing a piece of equipment. */
export interface Machine {
  id?: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints?: MonitoringPoint[];
}

/** Sensor type representing a monitoring sensor. */
export interface Sensor {
  id: string;
  name: "TcAg" | "TcAs" | "HF+";
}

/** Monitoring point type for tracking machine performance. */
export interface MonitoringPoint {
  id?: string;
  name: string;
  sensorId: string;
  sensorModel: string;
}

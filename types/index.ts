export interface Machine {
  id: string
  name: string
  type: "Pump" | "Fan"
}

export interface MonitoringPoint {
  id: string
  name: string
  machineId: string
  sensorModel: SensorModel
}

export type SensorModel = "TcAg" | "TcAs" | "HF+"

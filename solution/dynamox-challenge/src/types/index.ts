// Autenticação
export interface AuthState {
  user: string | null,
  isLoading: boolean,
  error: string | null,
  isLoggedIn: boolean,
}

// Máquina
export type SensorModel = "TcAg" | "TcAs" | "HF+";

export interface Sensor {
  name: string,
  id: string,
  model: SensorModel
}

export interface Machine {
  name: string,
  id: number,
  type: "Pump" | "Fan",
  sensors: Sensor[],
}

// Pontos de Monitoramento
export interface MonitoringPoint {
  id: number,
  name: string,
  machineId: number,
  sensor: Sensor
}

// define os tipos de dados 
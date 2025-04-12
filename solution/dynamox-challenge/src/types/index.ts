// Autenticação
export interface AuthState {
  id: number | null,
  user: string | null,
  isLoading: boolean,
  error: string | null,
  isLoggedIn: boolean,
}

// Máquina
export type SensorModel = "TcAg" | "TcAs" | "HF+";

export interface Sensor {
  name: string,
  id?: string,
  model: SensorModel
}

export interface Machine {
  name: string,
  id?: string,
  type: string,
  userId: number | null,
  sensors?: Sensor[],
}

// Pontos de Monitoramento
export interface MonitoringPoint {
  id?: string,
  name: string,
  machineId: string,
  sensor: Sensor
}

// define os tipos de dados 
// Autenticação
export interface AuthState {
  id: number | null,
  user: string | null,
  isLoading: boolean,
  error: string | null,
  isLoggedIn: boolean,
}

export type SensorModel = "TcAg" | "TcAs" | "HF+";

export interface Sensor {
  name: string,
  id: string,
  model: SensorModel
}

export interface Machine {
  name: string,
  id?: string,
  type: string,
  userId: number | null,
  monitoringPoints?: MonitoringPoint[],
}

// Pontos de Monitoramento
export interface MonitoringPoint {
  id: string,
  name: string,
  machineId: string,
  sensorId?: string
}

export type Action =
  | { type: "GET_USER"; payload: { id: number, username: string; role: string, machines: Machine[], sensors: Sensor[] } }
  | { type: "GET_MACHINES"; payload: Machine[] }
  | {type: "POST_MACHINE"; payload: Machine}
  | { type: "DELETE_MACHINE"; payload: Machine }
  | { type: "UPDATE_MACHINE"; payload: Machine }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGIN_REQUEST"; payload: { email: string; password: string } }
  | { type: "LOGOUT" }

// define os tipos de dados e actions
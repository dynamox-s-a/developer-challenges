import type { MachineType } from "../machines/types"

export type SensorModel = 'TcAg' | 'TcAs' | 'HF+'

export type Sensor = {
  id: string
  model: SensorModel
}

export type MonitoringPoint = {
  id: string
  machineId: string
  name: string
  sensor: Sensor | null
}

export type MonitoringState = {
  items: MonitoringPoint[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}


export type MonitoringPointRow = {
  id: string
  machineId: string
  machineName: string
  machineType: MachineType
  monitoringPointName: string
  sensorModel: SensorModel | null
}

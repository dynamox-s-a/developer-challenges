import type { ApiResponse } from '../../types/api.types'

export type SensorModel = 'TcAg' | 'TcAs' | 'HF_PLUS'

export interface Sensor {
  uuid: string
  sensorUniqueId: string
  model: SensorModel
}

export interface SensorWithMonitoringPoint extends Sensor {
  monitoringPoint: {
    uuid: string
    name: string
  }
}

export interface CreateSensorInput {
  monitoringPointUuid: string
  sensorUniqueId: string
  model: SensorModel
}

export interface UpdateSensorInput {
  uuid: string
  sensorUniqueId?: string
  model?: SensorModel
}

export interface SensorsState {
  items: Sensor[]
  selected: Sensor | null
  status: {
    fetch: {
      loading: boolean
      error: string | null
    }
    create: {
      loading: boolean
      error: string | null
    }
    update: {
      loading: boolean
      error: string | null
    }
    remove: {
      loading: boolean
      error: string | null
    }
  }
}

export type SensorResponse = ApiResponse<Sensor>
export type SensorsResponse = ApiResponse<SensorWithMonitoringPoint[]>

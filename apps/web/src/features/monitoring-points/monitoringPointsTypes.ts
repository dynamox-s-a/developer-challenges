import type { ApiResponse } from '../../types/api.types'

export type SensorModel = 'TcAg' | 'TcAs' | 'HF_PLUS'

export interface MonitoringPointSensor {
  uuid: string
  sensorUniqueId: string
  model: SensorModel
  hasTelemetry: boolean
}

export interface MonitoringPointMachine {
  uuid: string
  name: string
  type: 'Pump' | 'Motor'
}

export interface MonitoringPoint {
  uuid: string
  name: string
  machine: MonitoringPointMachine
  sensor: MonitoringPointSensor | null
}

export interface MonitoringPointsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface MonitoringPointsPayload {
  data: MonitoringPoint[]
  pagination: MonitoringPointsPagination
}

export type MonitoringSortBy =
  | 'machineName'
  | 'machineType'
  | 'name'
  | 'sensorModel'
  | 'createdAt'

export type SortOrder = 'asc' | 'desc'

export interface MonitoringPointsQuery {
  machineUuid?: string
  page?: number
  limit?: number
  sortBy?: MonitoringSortBy
  sortOrder?: SortOrder
}

export interface CreateMonitoringPointInput {
  name: string
  machineUuid: string
}

export interface UpdateMonitoringPointInput {
  uuid: string
  name: string
}

export type MonitoringPointsResponse = ApiResponse<MonitoringPointsPayload>
export type MonitoringPointResponse = ApiResponse<MonitoringPoint>

export interface MonitoringPointsState {
  items: MonitoringPoint[]
  selected: MonitoringPoint | null
  meta: {
    pagination: MonitoringPointsPagination
  }
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

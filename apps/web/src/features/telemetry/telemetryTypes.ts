import type { ApiResponse } from '../../types/api.types'

export type TelemetryOrder = 'asc' | 'desc'

export interface TelemetryPointInput {
  timestamp: string | Date
  x: number
  y: number
  z: number
  temperature: number
}

export interface TelemetryPoint {
  timestamp: string
  x: number
  y: number
  z: number
  temperature: number
  accelerationRms: number
}

export interface TelemetrySensorSummary {
  uuid: string
  sensorUniqueId: string
  model: 'TcAg' | 'TcAs' | 'HF_PLUS'
}

export interface TelemetrySeriesQuery {
  from?: string | Date
  to?: string | Date
  limit?: number
  order?: TelemetryOrder
}

export interface TelemetrySeriesResult {
  sensor: TelemetrySensorSummary
  query: {
    from: string | null
    to: string | null
    limit: number
    order: TelemetryOrder
  }
  points: TelemetryPoint[]
}

export interface CreateTelemetrySeriesInput {
  sensorUuid: string
  intervalMinutes?: number
  points: TelemetryPointInput[]
}

export interface CreateTelemetrySeriesResult {
  batchUuid: string
  receivedPoints: number
  uniquePoints: number
  insertedPoints: number
  duplicatesInPayload: number
  duplicatesSkippedByDb: number
  fromTimestamp: string
  toTimestamp: string
}

export interface TelemetryCountResult {
  timeSeriesCount: number
  pointsCount: number
}

export interface TelemetryMetricsQuery {
  sensorUuid: string
  from?: string | Date
  to?: string | Date
}

export interface TelemetryMetricAxis {
  min: number | null
  max: number | null
  avg: number | null
}

export interface TelemetryMetricsResult {
  pointsCount: number
  range: {
    from: string | null
    to: string | null
  }
  firstTimestamp: string | null
  lastTimestamp: string | null
  x: TelemetryMetricAxis
  y: TelemetryMetricAxis
  z: TelemetryMetricAxis
  temperature: TelemetryMetricAxis
  accelerationRms: TelemetryMetricAxis
  lastPoint: TelemetryPoint | null
}

export interface DeleteTelemetrySeriesInput {
  sensorUuid: string
  from?: string | Date
  to?: string | Date
  all?: boolean
}

export interface DeleteTelemetrySeriesResult {
  deletedPoints: number
  deletedBatches: number
  mode: 'all' | 'range'
  range: {
    from: string | null
    to: string | null
  }
}

export interface DeleteTelemetryBatchResult {
  batchUuid: string
  deletedPoints: number
}

export interface TelemetryState {
  items: TelemetryPoint[]
  selected: {
    sensorUuid: string
  } | null
  meta: {
    series: TelemetrySeriesResult | null
    count: TelemetryCountResult | null
    metrics: TelemetryMetricsResult | null
    created: CreateTelemetrySeriesResult | null
    deleted: DeleteTelemetrySeriesResult | null
    deletedBatch: DeleteTelemetryBatchResult | null
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

export type TelemetrySeriesResponse = ApiResponse<TelemetrySeriesResult>
export type CreateTelemetrySeriesResponse = ApiResponse<CreateTelemetrySeriesResult>
export type TelemetryCountResponse = ApiResponse<TelemetryCountResult>
export type TelemetryMetricsResponse = ApiResponse<TelemetryMetricsResult>
export type DeleteTelemetrySeriesResponse = ApiResponse<DeleteTelemetrySeriesResult>
export type DeleteTelemetryBatchResponse = ApiResponse<DeleteTelemetryBatchResult>

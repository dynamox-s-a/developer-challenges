import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { getApiErrorMessage } from '../../utils/apiError'
import type {
  CreateTelemetrySeriesInput,
  CreateTelemetrySeriesResponse,
  CreateTelemetrySeriesResult,
  DeleteTelemetryBatchResponse,
  DeleteTelemetryBatchResult,
  DeleteTelemetrySeriesInput,
  DeleteTelemetrySeriesResponse,
  DeleteTelemetrySeriesResult,
  TelemetryCountResponse,
  TelemetryCountResult,
  TelemetryMetricsQuery,
  TelemetryMetricsResponse,
  TelemetryMetricsResult,
  TelemetrySeriesQuery,
  TelemetrySeriesResponse,
  TelemetrySeriesResult
} from './telemetryTypes'

function toQueryDate(value?: string | Date) {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  return value
}

export const fetchTelemetrySeriesThunk = createAsyncThunk<
  TelemetrySeriesResult,
  { sensorUuid: string; query?: TelemetrySeriesQuery }
>('telemetry/fetchSeries', async ({ sensorUuid, query }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<TelemetrySeriesResponse>(
      `/sensors/${sensorUuid}/time-series`,
      {
        params: {
          ...query,
          from: toQueryDate(query?.from),
          to: toQueryDate(query?.to)
        }
      }
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao carregar série temporal')
    )
  }
})

export const createTelemetrySeriesThunk = createAsyncThunk<
  CreateTelemetrySeriesResult,
  CreateTelemetrySeriesInput
>('telemetry/createSeries', async ({ sensorUuid, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.post<CreateTelemetrySeriesResponse>(
      `/sensors/${sensorUuid}/time-series`,
      payload
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao criar série temporal')
    )
  }
})

export const fetchTelemetryCountThunk = createAsyncThunk<
  TelemetryCountResult,
  { sensorUuid: string }
>('telemetry/fetchCount', async ({ sensorUuid }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<TelemetryCountResponse>(
      `/sensors/${sensorUuid}/time-series/count`
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao carregar contagem de telemetria')
    )
  }
})

export const fetchTelemetryMetricsThunk = createAsyncThunk<
  TelemetryMetricsResult,
  TelemetryMetricsQuery
>('telemetry/fetchMetrics', async ({ sensorUuid, ...query }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<TelemetryMetricsResponse>(
      `/sensors/${sensorUuid}/time-series/metrics`,
      {
        params: {
          ...query,
          from: toQueryDate(query.from),
          to: toQueryDate(query.to)
        }
      }
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao carregar métricas de telemetria')
    )
  }
})

export const deleteTelemetrySeriesThunk = createAsyncThunk<
  DeleteTelemetrySeriesResult,
  DeleteTelemetrySeriesInput
>('telemetry/deleteSeries', async ({ sensorUuid, ...query }, { rejectWithValue }) => {
  try {
    const { data } = await api.delete<DeleteTelemetrySeriesResponse>(
      `/sensors/${sensorUuid}/time-series`,
      {
        params: {
          ...query,
          from: toQueryDate(query.from),
          to: toQueryDate(query.to)
        }
      }
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao deletar série temporal')
    )
  }
})

export const deleteTelemetryBatchThunk = createAsyncThunk<
  DeleteTelemetryBatchResult,
  { batchUuid: string }
>('telemetry/deleteBatch', async ({ batchUuid }, { rejectWithValue }) => {
  try {
    const { data } = await api.delete<DeleteTelemetryBatchResponse>(
      `/sensors/telemetry/batches/${batchUuid}`
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao deletar lote de telemetria')
    )
  }
})

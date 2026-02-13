import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { getApiErrorMessage } from '../../utils/apiError'
import type {
  CreateMonitoringPointInput,
  MonitoringPoint,
  MonitoringPointsPayload,
  MonitoringPointsQuery,
  MonitoringPointsResponse,
  MonitoringPointResponse,
  UpdateMonitoringPointInput
} from './monitoringPointsTypes'

export const fetchMonitoringPointsThunk = createAsyncThunk<
  MonitoringPointsPayload,
  MonitoringPointsQuery | undefined
>('monitoringPoints/fetchAll', async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.get<MonitoringPointsResponse>('/monitoring-points', {
      params: query
    })
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao carregar pontos de monitoramento')
    )
  }
})

export const createMonitoringPointThunk = createAsyncThunk<
  MonitoringPoint,
  CreateMonitoringPointInput
>('monitoringPoints/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<MonitoringPointResponse>(
      '/monitoring-points',
      payload
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao criar ponto de monitoramento')
    )
  }
})

export const updateMonitoringPointThunk = createAsyncThunk<
  MonitoringPoint,
  UpdateMonitoringPointInput
>('monitoringPoints/update', async ({ uuid, name }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<MonitoringPointResponse>(
      `/monitoring-points/${uuid}`,
      { name }
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao atualizar ponto de monitoramento')
    )
  }
})

export const deleteMonitoringPointThunk = createAsyncThunk<string, string>(
  'monitoringPoints/delete',
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/monitoring-points/${uuid}`)
      return uuid
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Falha ao deletar ponto de monitoramento')
      )
    }
  }
)

import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { getApiErrorMessage } from '../../utils/apiError'
import type {
  CreateSensorInput,
  Sensor,
  SensorResponse,
  SensorsResponse,
  SensorWithMonitoringPoint,
  UpdateSensorInput
} from './sensorsTypes'

export const fetchSensorsThunk = createAsyncThunk<SensorWithMonitoringPoint[]>(
  'sensors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<SensorsResponse>('/sensors')
      return data.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao carregar sensores'))
    }
  }
)

export const createSensorThunk = createAsyncThunk<Sensor, CreateSensorInput>(
  'sensors/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<SensorResponse>('/sensors', payload)
      return data.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao criar sensor'))
    }
  }
)

export const updateSensorThunk = createAsyncThunk<Sensor, UpdateSensorInput>(
  'sensors/update',
  async ({ uuid, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<SensorResponse>(`/sensors/${uuid}`, payload)
      return data.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao atualizar sensor'))
    }
  }
)

export const deleteSensorThunk = createAsyncThunk<string, string>(
  'sensors/delete',
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/sensors/${uuid}`)
      return uuid
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao deletar sensor'))
    }
  }
)

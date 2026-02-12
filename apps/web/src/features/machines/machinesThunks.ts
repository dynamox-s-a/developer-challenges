import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { getApiErrorMessage } from '../../utils/apiError'
import type {
  CreateMachineInput,
  Machine,
  MachineResponse,
  MachinesResponse,
  UpdateMachineInput
} from './machinesTypes'

export const fetchMachinesThunk = createAsyncThunk<Machine[]>(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<MachinesResponse>('/machines')
      return data.data
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Falha ao carregar máquinas')
      )
    }
  }
)

export const fetchMachineByIdThunk = createAsyncThunk<Machine, string>(
  'machines/fetchById',
  async (uuid, { rejectWithValue }) => {
    try {
      const { data } = await api.get<MachineResponse>(`/machines/${uuid}`)
      return data.data
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Falha ao carregar máquina')
      )
    }
  }
)

export const createMachineThunk = createAsyncThunk<Machine, CreateMachineInput>(
  'machines/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<MachineResponse>('/machines', payload)
      return data.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao criar máquina'))
    }
  }
)

export const updateMachineThunk = createAsyncThunk<
  Machine,
  { uuid: string; data: UpdateMachineInput }
>('machines/update', async ({ uuid, data: payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<MachineResponse>(
      `/machines/${uuid}`,
      payload
    )
    return data.data
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, 'Falha ao atualizar máquina')
    )
  }
})

export const deleteMachineThunk = createAsyncThunk<string, string>(
  'machines/delete',
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/machines/${uuid}`)
      return uuid
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Falha ao deletar máquina')
      )
    }
  }
)

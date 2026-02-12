import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { api } from '../../services/api'
import type { ApiErrorResponse } from '../../types/api.types'
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
      console.log(data)
      return data.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao carregar máquinas'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao carregar máquinas')
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
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao carregar máquina'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao carregar máquina')
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
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao criar máquina'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao criar máquina')
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
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse
      const message =
        apiError?.message || error.message || 'Falha ao atualizar máquina'
      return rejectWithValue(message)
    }
    return rejectWithValue('Erro desconhecido ao atualizar máquina')
  }
})

export const deleteMachineThunk = createAsyncThunk<string, string>(
  'machines/delete',
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/machines/${uuid}`)
      return uuid
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao deletar máquina'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao deletar máquina')
    }
  }
)

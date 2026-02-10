import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { api } from '../../services/api'
import type { ApiErrorResponse } from '../../types/api.types'
import type { LoginInput, LoginResponse } from './authTypes'

export const loginThunk = createAsyncThunk<LoginResponse, LoginInput>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao autenticar'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao autenticar')
    }
  }
)

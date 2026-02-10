import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { api } from '../../services/api'
import type { ApiErrorResponse } from '../../types/api.types'
import type {
  AuthUser,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse
} from './authTypes'

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

export const meThunk = createAsyncThunk<AuthUser>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ success: boolean; data: AuthUser }>(
        '/api/auth/me'
      )
      return data.data
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiErrorResponse
        const message =
          apiError?.message || err.message || 'Falha ao carregar usuário'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao carregar usuário')
    }
  }
)

export const registerThunk = createAsyncThunk<RegisterResponse, RegisterInput>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<RegisterResponse>(
        '/api/auth/register',
        payload
      )
      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse
        const message =
          apiError?.message || error.message || 'Falha ao registrar'
        return rejectWithValue(message)
      }
      return rejectWithValue('Erro desconhecido ao registrar')
    }
  }
)

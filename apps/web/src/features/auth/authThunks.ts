import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { getApiErrorMessage } from '../../utils/apiError'
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
      const { data } = await api.post<LoginResponse>('/auth/login', payload)
      return data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao autenticar'))
    }
  }
)

export const meThunk = createAsyncThunk<AuthUser>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ success: boolean; data: AuthUser }>(
        '/auth/me'
      )
      return data.data
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Falha ao carregar usuário')
      )
    }
  }
)

export const registerThunk = createAsyncThunk<RegisterResponse, RegisterInput>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<RegisterResponse>(
        '/auth/register',
        payload
      )
      return data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Falha ao registrar'))
    }
  }
)

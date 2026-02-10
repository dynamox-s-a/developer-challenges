import type { ApiResponse } from '../../types/api.types'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  token: string | null
  user: AuthUser | null
  errorMessage: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthUser {
  uuid: string
  email: string
  name?: string
}

export interface LoginData {
  token: string
  user: AuthUser
}

export type LoginResponse = ApiResponse<LoginData>

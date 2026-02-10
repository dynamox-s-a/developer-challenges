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

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface RegisterUser {
  uuid: string
  email: string
  name: string
  createdAt: string
}

export interface RegisterData {
  user: RegisterUser
}

export type RegisterResponse = ApiResponse<RegisterData>
export type LoginResponse = ApiResponse<LoginData>

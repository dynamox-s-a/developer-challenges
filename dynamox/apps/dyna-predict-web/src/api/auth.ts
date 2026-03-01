import api from './client'
import type { LoginRequest, LoginResponse } from '@dynamox/types'

export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', credentials),
  logout: () =>
    api.post('/auth/logout'),
  me: () =>
    api.get<LoginResponse>('/auth/me')

}

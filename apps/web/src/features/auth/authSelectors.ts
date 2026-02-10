import type { RootState } from '../../app/store'

export const selectAuthStatus = (s: RootState) => s.auth.status
export const selectAuthToken = (s: RootState) => s.auth.token
export const selectAuthUser = (s: RootState) => s.auth.user
export const selectAuthError = (s: RootState) => s.auth.errorMessage
export const selectIsAuthenticated = (s: RootState) =>
  s.auth.status === 'authenticated' && !!s.auth.token

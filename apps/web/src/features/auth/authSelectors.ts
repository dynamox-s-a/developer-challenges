import type { RootState } from '../../app/store'

export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthError = (state: RootState) => state.auth.errorMessage
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === 'authenticated' && !!state.auth.token

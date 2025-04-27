import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  email: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUserRequest(state: AuthState) {
      state.isLoading = true
      state.error = null
    },
    loginUserSuccess(state: AuthState, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    loginUserFailure(state: AuthState, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    logoutUserRequest(state: AuthState) {
      state.isLoading = true
      state.error = null
    },
    logoutUserSuccess(state: AuthState) {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    logoutUserFailure(state: AuthState, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  loginUserRequest,
  loginUserSuccess,
  loginUserFailure,
  logoutUserRequest,
  logoutUserSuccess,
  logoutUserFailure,
} = authSlice.actions

export default authSlice.reducer

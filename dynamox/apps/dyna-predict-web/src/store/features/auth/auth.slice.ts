// store/features/auth/auth.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { authAPI } from '../../../api/auth'
import { User } from '@dynamox/types'

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials)
    return response.data
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authAPI.logout()
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async () => {
    const response = await authAPI.me()
    return response.data
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.currentUser = action.payload.user
      })
      .addCase(login.rejected, state => {
        state.isLoading = false
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.currentUser = action.payload.user
      })
  }
})

export default authSlice.reducer

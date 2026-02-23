import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from './authTypes'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false

      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token
        })
      )
    },

    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false

      localStorage.removeItem('auth')
    },

    loadFromStorage(state) {
      const data = localStorage.getItem('auth')

      if (data) {
        const parsed = JSON.parse(data)
        state.user = parsed.user
        state.token = parsed.token
        state.isAuthenticated = true
      }

      state.isLoading = false
    }
  }
})

export const { loginSuccess, logout, loadFromStorage } =
  authSlice.actions

export default authSlice.reducer
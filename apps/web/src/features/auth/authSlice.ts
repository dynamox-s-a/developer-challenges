import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { tokenStorage } from '../../services/tokenStorage'
import type { AuthState } from './authTypes'
import { loginThunk, meThunk, registerThunk } from './authThunks'

const initialState: AuthState = {
  status: tokenStorage.get() ? 'authenticated' : 'idle',
  token: tokenStorage.get(),
  user: null,
  errorMessage: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.status = 'idle'
      state.token = null
      state.user = null
      state.errorMessage = null
      tokenStorage.clear()
    },
    clearAuthError(state) {
      state.errorMessage = null
      if (state.status === 'error') state.status = 'idle'
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      state.status = 'authenticated'
      tokenStorage.set(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.status = 'authenticated'
          state.token = action.payload.data.token
          state.user = action.payload.data.user
          state.errorMessage = null
          tokenStorage.set(action.payload.data.token)
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'error'
        state.token = null
        state.user = null
        state.errorMessage = (action.payload as string) || 'Falha ao autenticar'
        tokenStorage.clear()
      })
      .addCase(meThunk.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload
      })
      .addCase(meThunk.rejected, (state, action) => {
        state.status = 'error'
        state.token = null
        state.user = null
        state.errorMessage = (action.payload as string) || 'Sessão expirada'
        tokenStorage.clear()
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.status = 'authenticated'
          state.user = {
            uuid: action.payload.data.user.uuid,
            email: action.payload.data.user.email,
            name: action.payload.data.user.name
          }
          state.errorMessage = null
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'error'
        state.user = null
        state.errorMessage = (action.payload as string) || 'Falha ao registrar'
      })
  }
})

export const { logout, clearAuthError, setToken } = authSlice.actions
export default authSlice.reducer

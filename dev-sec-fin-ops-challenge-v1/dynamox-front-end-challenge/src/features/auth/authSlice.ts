import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState } from './types'
import { loginThunk } from './authThunks'

const TOKEN_KEY = 'auth_token'

const initialState: AuthState = {
    token: localStorage.getItem(TOKEN_KEY),
    status: 'idle',
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null
            state.status = 'idle'
            state.error = null
            localStorage.removeItem(TOKEN_KEY)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'idle'
                state.token = action.payload
                localStorage.setItem(TOKEN_KEY, action.payload)
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha no login'
            })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
export { TOKEN_KEY }

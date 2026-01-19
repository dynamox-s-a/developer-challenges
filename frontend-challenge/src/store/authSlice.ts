import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/User'

interface AuthState {
    user: User | null
    token: string | null
}

const initialState: AuthState = {
    user: null,
    token: null
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
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        },
        logout(state) {
            state.user = null
            state.token = null
            localStorage.clear()
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer

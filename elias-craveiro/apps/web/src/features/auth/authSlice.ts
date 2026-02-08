import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authThunk } from './authThunks';

type User = { id: number; email: string };

type AuthState = {
    accessToken: string | null;
    user: User | null;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
};

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    user: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null,
    status: 'idle',
    error: null,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.accessToken = null;
            state.user = null;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        },
    },
    extraReducers(builder) {
        builder
            .addCase(authThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(authThunk.fulfilled, (state, action) => {
                state.status = 'idle';
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem(
                    'user',
                    JSON.stringify(action.payload.user),
                );
            })
            .addCase(authThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Login failed';
            });
    },
});

export const { logout } = slice.actions;
export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../config/api";
import { addAsyncHandlers } from "../../utils/redux.utils";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthResponse {
    user: User | null;
    token: string;
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) =>{
        try {

            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const data = response.data;

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { 
                token: data.access_token,
                user: data.user
            } as AuthResponse;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Falha na autenticacao';
            return rejectWithValue(message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('auth/signup', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
};

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    signupSuccess: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.clear();
        },
        resetSignupStatus: (state) => {
            state.signupSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        addAsyncHandlers(builder, loginUser, {
            onFulfilled: (state, action: PayloadAction<AuthResponse>) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            }
        });

        addAsyncHandlers(builder, registerUser, {
            onPending: (state) => {
                state.signupSuccess = false;
            },
            onFulfilled: (state) => {
                state.signupSuccess = true;
            },
            onRejected: (state) => {
                state.signupSuccess = false;
            }
        });
    },
});

export const { logout, resetSignupStatus } = authSlice.actions;
export default authSlice.reducer;

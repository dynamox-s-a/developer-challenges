import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthLoginRequest, AuthLoginResponse } from '@dynamox/shared';
import { authApi } from '../../services/api';
import { ApiClientError } from '../../services/apiClient';

interface AuthState {
  user: AuthLoginResponse['user'] | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  initialized: boolean;
}

const storedToken = localStorage.getItem('accessToken');

const initialState: AuthState = {
  user: null,
  accessToken: storedToken,
  status: 'idle',
  error: null,
  initialized: !storedToken,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: AuthLoginRequest, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to login');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    // Always clear local session even if the API call fails
  }
});

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to restore session');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthLoginResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.initialized = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        state.error = null;
        localStorage.removeItem('accessToken');
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.initialized = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        state.initialized = true;
        localStorage.removeItem('accessToken');
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

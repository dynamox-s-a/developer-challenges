import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@dynamox/types';
import type { BaseState } from '../../types';
import { authAPI } from '../../../api/auth';
import { extractErrorMessage } from '../../../utils/form-errors';

export interface AuthState extends BaseState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  currentUser: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao fazer login'));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    return null;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Erro ao fazer logout'));
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const response = await authAPI.me();
  return response.data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Erro ao fazer login';
      });

    builder.addCase(logout.fulfilled, () => initialState);

    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao carregar as informações do usuário';
        state.isAuthenticated = false;
        state.currentUser = null;
      });
  },
});

export default authSlice.reducer;

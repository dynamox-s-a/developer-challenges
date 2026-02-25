import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser } from '@/services/authService';
import { saveToken } from '@/utils/token';

export const login = createAsyncThunk('auth/login', async (user: { email: string; password: string }) => {
  const response = await loginUser(user.email, user.password);
  saveToken(response.token);
  return response;
});

interface AuthState {
  user: {
    email: string;
    role: string;
  };
  loading: boolean;
  error: string;
}
const initialState: AuthState = {
  user: {
    email: '',
    role: '',
  },
  loading: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {
        email: '',
        role: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao fazer login';
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

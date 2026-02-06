import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/api";
import {
  generateFakeToken,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  decodeFakeToken,
} from "@/utils/auth";

interface User {
  id: number;
  email: string;
  role: "admin" | "reader";
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const user = await authService.login(email, password);

      if (!user) {
        return rejectWithValue("Credenciais inválidas");
      }

      const token = generateFakeToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      setAuthToken(token);

      return { user, token };
    } catch {
      return rejectWithValue("Erro ao fazer login");
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();

    if (!token) {
      return rejectWithValue("Sem token");
    }

    const decoded = decodeFakeToken(token);

    if (!decoded) {
      removeAuthToken();
      return rejectWithValue("Token inválido ou expirado");
    }

    try {
      const user = await authService.getUserById(decoded.id);

      if (!user) {
        removeAuthToken();
        return rejectWithValue("Usuário não encontrado");
      }

      return { user, token };
    } catch {
      removeAuthToken();
      return rejectWithValue("Erro ao verificar autenticação");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkAuth.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

import { authService } from "@/services/api";
import {
  decodeFakeToken,
  generateFakeToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "@/utils/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

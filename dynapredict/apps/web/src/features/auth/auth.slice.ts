import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LoginInput } from '@dynapredict/shared';
import { api, getApiErrorMessage } from '../../lib/api-client';
import { tokenStorage } from '../../lib/token-storage';

export type AuthUser = {
  id: string;
  email: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
};

// Uma função, e não um objeto pronto: o Redux chama ela na hora de criar o
// estado, então o token é lido do localStorage nesse momento. Se já tinha
// logado antes, continua logado depois do F5
const initialState = (): AuthState => ({
  token: tokenStorage.get(),
  user: null,
  status: 'idle',
  error: null,
});

// <o que devolve quando dá certo, o que recebe, o formato do erro>
export const login = createAsyncThunk<
  LoginResponse,
  LoginInput,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    tokenStorage.set(data.token);
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// Confere se o token guardado ainda vale e busca os dados do usuário
export const fetchCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<{ user: AuthUser }>('/auth/me');
    return data.user;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// A API não guarda sessões (o JWT é "sem estado"), então sair = jogar o
// token fora no front. É um thunk porque mexe no localStorage (efeito
// colateral), e reducer não pode fazer isso.
// Recebe opcionalmente um motivo, que aparece na tela de login
export const logout = createAsyncThunk<void, string | undefined>(
  'auth/logout',
  async () => {
    tokenStorage.clear();
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro inesperado';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.error = action.meta.arg ?? null; // o motivo do logout, se houver
      });
  },
});

export const authReducer = authSlice.reducer;

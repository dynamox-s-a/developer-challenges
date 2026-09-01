import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { canMutate } from '@dynamox/domain';

import { api, getToken, setToken, UnauthorizedError, type SessionUser } from '../../api/client';
import type { RootState } from '../../store';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthState {
  status: AuthStatus;
  user: SessionUser | null;
  error: string | null;
}

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const { token, user } = await api.login(credentials.email, credentials.password);
    setToken(token);
    return user;
  },
);

/**
 * Restaura a sessão após reload: se há token guardado, /auth/me o valida no backend.
 * Guarda o token do início do thunk: se um login trocar o token enquanto a restauração
 * está em voo, o resultado obsoleto não pode limpar o JWT novo nem derrubar a sessão.
 */
type RestoreSessionResult = SessionUser | null | 'stale';

export const restoreSession = createAsyncThunk<RestoreSessionResult>(
  'auth/restoreSession',
  async () => {
  const tokenAtStart = getToken();
  if (!tokenAtStart) return null;
  try {
    const user = await api.me();
    return getToken() === tokenAtStart ? user : 'stale';
  } catch (error) {
    if (getToken() !== tokenAtStart) return 'stale';
    // Só um 401 real invalida a sessão. Falha transitória (rede fora, 5xx) preserva o
    // token: o usuário volta ao login agora, mas o próximo reload tenta restaurar de novo.
    if (error instanceof UnauthorizedError) setToken(null);
    return null;
  }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  setToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    /** Disparado pelo tratamento central de 401: qualquer chamada com sessão inválida. */
    sessionExpired(state) {
      setToken(null);
      state.status = 'unauthenticated';
      state.user = null;
      state.error = 'Sua sessão expirou. Entre novamente.';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.user = null;
        state.error = action.error.message ?? 'Falha no login.';
      })
      .addCase(restoreSession.pending, (state) => {
        // Um login concluído durante a restauração não pode voltar para "loading".
        if (state.status !== 'authenticated') state.status = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload === 'stale') return; // resultado obsoleto: um login assumiu no meio
        if (action.payload) {
          state.status = 'authenticated';
          state.user = action.payload;
        } else if (state.status !== 'authenticated') {
          state.status = 'unauthenticated';
          state.user = null;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        if (state.status !== 'authenticated') {
          state.status = 'unauthenticated';
          state.user = null;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectAuthenticatedUser = (state: RootState): SessionUser | null => state.auth.user;
export const selectAuthStatus = (state: RootState): AuthStatus => state.auth.status;

/**
 * Permissão de escrita da sessão. O backend continua sendo a barreira real (responde 403);
 * isto existe para não oferecer ao usuário uma ação que ele não pode concluir.
 */
export const selectCanMutate = (state: { auth: AuthState }): boolean =>
  state.auth.user !== null && canMutate(state.auth.user.role);

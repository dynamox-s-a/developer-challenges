import type { AuthUserDto, LoginRequest } from '@dynapredict/shared-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { type ApiError, toApiError } from '../../services/apiClient';
import * as authApi from '../../services/authApi';

/**
 * - `unknown`: the boot check (`fetchMe`) hasn't finished, so private routes
 *   must wait instead of redirecting a user who is in fact logged in.
 * - `authenticated` / `unauthenticated`: the answer.
 */
export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUserDto | null;
  loginPending: boolean;
  /** Why the last login failed, or why the session ended; shown on /login. */
  error: ApiError | null;
}

const initialState: AuthState = {
  status: 'unknown',
  user: null,
  loginPending: false,
  error: null,
};

export const SESSION_EXPIRED_ERROR: ApiError = {
  status: 401,
  code: 'SESSION_EXPIRED',
  message: 'Your session has expired. Please sign in again.',
};

export const login = createAsyncThunk<
  AuthUserDto,
  LoginRequest,
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authApi.login(credentials);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/** Hydrates the session from the cookie when the app boots. */
export const fetchMe = createAsyncThunk<
  AuthUserDto,
  void,
  { rejectValue: ApiError }
>('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/**
 * Ends the session on the server, then locally. The local logout happens
 * even if the request fails: the user asked to leave, and a stale cookie is
 * rejected by the API on its next use anyway.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    // Ignored on purpose, see above.
  }
});

function signedOut(state: AuthState, error: ApiError | null = null): void {
  state.status = 'unauthenticated';
  state.user = null;
  state.loginPending = false;
  state.error = error;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** A private request answered 401: the cookie expired or was revoked. */
    sessionExpired(state) {
      if (state.status === 'authenticated') {
        signedOut(state, SESSION_EXPIRED_ERROR);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginPending = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.loginPending = false;
      })
      .addCase(login.rejected, (state, action) => {
        signedOut(state, action.payload ?? toApiError(action.error));
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      // No session on boot is the normal logged-out case, not an error.
      .addCase(fetchMe.rejected, (state) => {
        if (state.status === 'unknown') signedOut(state);
      })
      .addCase(logout.fulfilled, (state) => signedOut(state));
  },
});

export const { sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthUser, LoginInput } from "@full-stack-solution/shared";
import { serializeApiError, type SerializedApiError } from "@web/api/api-error";
import type { ThunkConfig } from "@web/app/thunk";
import * as authApi from "./auth.api";
import { tokenStorage } from "./token-storage";

/**
 * `unknown` means "there is a token in storage but it has not been validated
 * yet": the router must wait instead of bouncing the user to the login page.
 */
export type SessionStatus = "unknown" | "authenticated" | "anonymous";

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: SessionStatus;
  /** A login attempt is in flight. */
  isSigningIn: boolean;
  error: SerializedApiError | null;
  /** Set when the session ended because the token was rejected. */
  expired: boolean;
}

const storedToken = tokenStorage.read();

const initialState: AuthState = {
  token: storedToken,
  user: null,
  status: storedToken ? "unknown" : "anonymous",
  isSigningIn: false,
  error: null,
  expired: false,
};

export const signIn = createAsyncThunk<
  { token: string; user: AuthUser },
  LoginInput,
  ThunkConfig
>("auth/signIn", async (credentials, { rejectWithValue }) => {
  try {
    const { accessToken, user } = await authApi.login(credentials);
    return { token: accessToken, user };
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

/**
 * Validates the token kept in storage on application start.
 *
 * Without this check a tampered or expired token would let the UI render the
 * private area until the first data request failed.
 */
export const restoreSession = createAsyncThunk<AuthUser, void, ThunkConfig>(
  "auth/restoreSession",
  async (_arg, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    if (!token) {
      return rejectWithValue({
        status: 401,
        code: "UNAUTHORIZED",
        message: "No session to restore",
      });
    }

    try {
      return await authApi.getCurrentUser(token);
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const signOut = createAsyncThunk<void, void, ThunkConfig>(
  "auth/signOut",
  async (_arg, { getState }) => {
    const { token } = getState().auth;

    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Logout is stateless; a failed call must not keep the user signed in.
      }
    }
  },
);

/**
 * Drops the session from the state. Storage is handled by
 * `tokenPersistenceMiddleware`, which keeps this reducer pure.
 */
function clearSession(state: AuthState, expired: boolean): void {
  state.token = null;
  state.user = null;
  state.status = "anonymous";
  state.expired = expired;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Dispatched by the auth middleware when any request returns 401. */
    sessionExpired(state) {
      if (state.status !== "anonymous" || state.token) {
        clearSession(state, true);
      }
    },
    loginErrorDismissed(state) {
      state.error = null;
      state.expired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isSigningIn = true;
        state.error = null;
        state.expired = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isSigningIn = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "authenticated";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isSigningIn = false;
        state.error = action.payload ?? null;
        state.status = "anonymous";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(restoreSession.rejected, (state) => {
        clearSession(state, false);
      })
      .addCase(signOut.fulfilled, (state) => {
        clearSession(state, false);
      });
  },
});

export const { sessionExpired, loginErrorDismissed } = authSlice.actions;
export const authReducer = authSlice.reducer;

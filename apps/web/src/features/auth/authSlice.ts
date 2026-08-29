import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@dyn/contracts";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/asyncThunk";
import { clearSession, readSession, writeSession } from "../../auth/session";

type AuthStatus = "anonymous" | "checking" | "authenticated" | "submitting";

interface AuthState {
  status: AuthStatus;
  session: LoginResponse | null;
  error: string | null;
}

const restoredSession = readSession();

const initialState: AuthState = {
  status: restoredSession ? "checking" : "anonymous",
  session: restoredSession,
  error: null,
};

export const login = createAppAsyncThunk<LoginResponse, LoginRequest>(
  "auth/login",
  async (credentials, { extra }) => {
    const session = await extra.login(credentials);
    writeSession(session);
    return session;
  }
);

// Registration returns a full session, so a new account lands signed in without a second request.
export const register = createAppAsyncThunk<LoginResponse, RegisterRequest>(
  "auth/register",
  async (credentials, { extra }) => {
    const session = await extra.register(credentials);
    writeSession(session);
    return session;
  }
);

export const checkSession = createAppAsyncThunk<AuthenticatedUser, void>(
  "auth/checkSession",
  (_, { extra }) => extra.getMe()
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    // JWTs are stateless, so signing out is purely local: drop the stored session.
    logout(state) {
      clearSession();
      state.status = "anonymous";
      state.session = null;
      state.error = null;
    },
    sessionExpired(state) {
      clearSession();
      state.status = "anonymous";
      state.session = null;
      state.error = "Your session expired. Please sign in again.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "submitting";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.session = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "anonymous";
        state.error = action.error.message ?? "Unable to sign in.";
      })
      .addCase(register.pending, (state) => {
        state.status = "submitting";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.session = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "anonymous";
        state.error = action.error.message ?? "Unable to create the account.";
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        if (!state.session) {
          state.status = "anonymous";
          return;
        }
        state.session.user = action.payload;
        writeSession(state.session);
        state.status = "authenticated";
      })
      .addCase(checkSession.rejected, (state) => {
        clearSession();
        state.status = "anonymous";
        state.session = null;
      });
  },
});

export const { clearAuthError, logout, sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;

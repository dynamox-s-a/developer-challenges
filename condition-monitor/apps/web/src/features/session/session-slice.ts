import type { LoginRequest, SessionUser } from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { ApiError, getJson, postJson } from '../../api/http';

/**
 * Who is using the app. `unknown` until the API has answered: not having asked yet, or
 * not reaching the API, is not the same as being logged out.
 */
export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

export interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
  checking: boolean;
  /** Why the session could not be checked, when the API did not answer as expected. */
  error: string | null;
}

const initialState: SessionState = { status: 'unknown', user: null, checking: false, error: null };

/** Asks the API whose session the cookie carries. A 401 means logged out, not an error. */
export const fetchSession = createAsyncThunk<SessionUser | null, void, { rejectValue: string }>(
  'session/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson<SessionUser>('/auth/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      return rejectWithValue('Could not reach the API to check the session.');
    }
  },
);

/** Why a login failed, in the shape the form shows it. */
export type LoginFailure = RequestFailure;

/**
 * Logs in, then reads the user from the new session. A failure keeps the API's message
 * and field errors, which a plain thunk error would lose when serialized.
 */
export const login = createAsyncThunk<SessionUser, LoginRequest, { rejectValue: LoginFailure }>(
  'session/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await postJson('/auth/login', credentials);
      return await getJson<SessionUser>('/auth/me');
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const logout = createAsyncThunk('session/logout', () => postJson('/auth/logout'));

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    /** Any API call answered 401: the session ended, for example because it expired. */
    sessionExpired(state) {
      state.status = 'anonymous';
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.checking = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.checking = false;
        state.user = action.payload;
        state.status = action.payload ? 'authenticated' : 'anonymous';
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.checking = false;
        state.status = 'unknown';
        state.error = action.payload ?? 'Could not check the session.';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      // Logging out ends the session on this screen even if the API could not be told:
      // the cookie then simply expires within the hour.
      .addMatcher(logout.settled, (state) => {
        state.status = 'anonymous';
        state.user = null;
      });
  },
});

export const { sessionExpired } = sessionSlice.actions;

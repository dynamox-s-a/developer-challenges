import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authClient } from '@/lib/auth/client';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  isLoading: false,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const response = await authClient.signInWithPassword({ email, password });
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return { token: response.token };
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    const response = await authClient.signUp({ name, email, password });
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return { token: response.token };
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await authClient.signOut();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});


export default authSlice.reducer;

export type AuthStateType = AuthState;

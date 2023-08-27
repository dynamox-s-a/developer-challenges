import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  accessToken: string;
  email: string;
}

const INITIAL_STATE: { user: User } = {
  user: { id: '', accessToken: '', email: '' },
};

export const loginUser = createAsyncThunk(
  'loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }
      return data;
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    logout: () => {
      return INITIAL_STATE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      console.log('state', state);
      const newUser = {
        accessToken: payload.accessToken,
        email: payload.user.email,
        id: payload.user.id,
      };

      console.log('newUser', newUser);

      state.user = newUser;
    });
  },
});

export default userSlice.reducer;

export const { logout } = userSlice.actions;

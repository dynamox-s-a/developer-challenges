import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cookies from 'react-cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  accessToken: string;
  email: string;
}

const user = cookies.load('user');

const EMPTY_STATE = {
  user: {
    id: '',
    accessToken: '',
    email: '',
  },
};

const INITIAL_STATE: { user: User } = {
  user: {
    id: user?.id || '',
    accessToken: user?.accessToken || '',
    email: user?.email || '',
  },
};

export const loginUser = createAsyncThunk(
  'loginUser',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
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
    logout: (state) => {
      cookies.remove('user');
      return EMPTY_STATE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      const newUser = {
        accessToken: payload.accessToken,
        email: payload.user.email,
        id: payload.user.id,
      };
      cookies.save('user', newUser, {
        path: '/',
        maxAge: 60 * 60 * 24 * 6,
      });

      state.user = newUser;
    });
  },
});

export default userSlice.reducer;

export const { logout } = userSlice.actions;

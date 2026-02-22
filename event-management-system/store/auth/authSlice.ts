import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, User } from './authTypes';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    loadFromStorage(state) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginSuccess, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
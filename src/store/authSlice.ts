import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

const savedAuth = localStorage.getItem('auth_data');
const initialState: AuthState = savedAuth 
  ? JSON.parse(savedAuth) 
  : { isAuthenticated: false, userEmail: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload;
      localStorage.setItem('auth_data', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
      localStorage.removeItem('auth_data');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
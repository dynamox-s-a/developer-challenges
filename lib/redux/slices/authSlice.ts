import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/types/types'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: null, 
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    clearAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.authToken; // Defina o seletor para obter o authToken

export default authSlice.reducer;

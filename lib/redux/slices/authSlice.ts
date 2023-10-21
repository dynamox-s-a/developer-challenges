import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/types/types';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: null,
    userId: null, 
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload.token;
      state.userId = action.payload.userId; 
    },
    clearAuthToken: (state) => {
      state.authToken = null;
      state.userId = null; 
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.authToken;
export const selectUserId = (state: RootState) => state.auth.userId; 

export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthStateType } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = {
  auth: AuthStateType;
};
export type AppDispatch = typeof store.dispatch;

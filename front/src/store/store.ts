import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthStateType } from './authSlice';
import assetsReducer, { AssetsStateType } from './assetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetsReducer,
  },
});

export type RootState = {
  auth: AuthStateType;
  assets: AssetsStateType;
};
export type AppDispatch = typeof store.dispatch;

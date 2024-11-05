import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthStateType } from './authSlice';
import assetsReducer, { AssetsStateType } from './assetsSlice';
import sensorReducer, { SensorsStateType } from './sensorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetsReducer,
    sensors: sensorReducer,
  },
});

export type RootState = {
  auth: AuthStateType;
  assets: AssetsStateType;
  sensors: SensorsStateType;
};
export type AppDispatch = typeof store.dispatch;

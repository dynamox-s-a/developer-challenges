import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import machinesReducer from './machinesSlice';
import monitoringPointsReducer from './monitoringPointsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import machinesReducer from './slices/machinesSlice';
import monitoringPointsReducer from './slices/monitoringPointsSlice';
import sensorsReducer from './slices/sensorsSlice';
import timeSeriesReducer from './slices/timeSeriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
    sensors: sensorsReducer,
    timeSeries: timeSeriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

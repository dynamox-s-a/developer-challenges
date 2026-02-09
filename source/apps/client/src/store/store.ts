import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './slices/machinesSlice';
import monitoringPointsReducer from './slices/monitoringPointsSlice';
import telemetryReducer from './slices/telemetrySlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
    telemetry: telemetryReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

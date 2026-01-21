import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from '@/store/machine/machine.slices';
import monitoringReducer from '@/store/monitoring/monitoring.slices';

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    monitoring: monitoringReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

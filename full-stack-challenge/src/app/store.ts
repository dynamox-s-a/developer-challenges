import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import machinesReducer from '../features/machine/MachinesSlice';
import monitoringReducer from '../features/monitoring/MonitoringSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        machines: machinesReducer,
        monitoring: monitoringReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
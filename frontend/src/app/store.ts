import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import machineReducer from '../features/machines/machineSlice';
import monitoringPointReducer from '../features/monitoringPoints/monitoringPointSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        machines: machineReducer,
        monitoringPoints: monitoringPointReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

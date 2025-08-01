import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import machinesReducer from '../features/machine/MachinesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        machines: machinesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
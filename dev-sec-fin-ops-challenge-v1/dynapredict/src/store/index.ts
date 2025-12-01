import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Slices/authSlice';
import machinesSlice from './Slices/machineSlice';



export const store = configureStore({
  reducer: {
    auth: authSlice,
    machines: machinesSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventsSlice from './slices/eventsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authSlice, events: eventsSlice },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

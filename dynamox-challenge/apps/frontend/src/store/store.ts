import { configureStore } from '@reduxjs/toolkit'

import machineReducer from './machines/machines.slice'
import authReducer from './auth/auth.slice'
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    machines: machineReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
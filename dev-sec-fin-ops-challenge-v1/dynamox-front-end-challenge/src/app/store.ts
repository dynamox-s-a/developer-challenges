import { configureStore } from '@reduxjs/toolkit'
import machinesReducer from '../features/machines/machinesSlice'
import authReducer from '../features/auth/authSlice'
import monitoringReducer from '../features/monitoring/monitoringSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machinesReducer,
    monitoring: monitoringReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

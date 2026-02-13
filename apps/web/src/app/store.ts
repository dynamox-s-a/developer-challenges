import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import machinesReducer from '../features/machines/machinesSlice'
import monitoringPointsReducer from '../features/monitoring-points/monitoringPointsSlice'
import sensorsReducer from '../features/sensors/sensorsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
    sensors: sensorsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

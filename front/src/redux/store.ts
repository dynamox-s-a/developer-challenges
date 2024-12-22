import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import machineReducer from './slices/machineSlice'
import pointReducer from './slices/pointSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    machine: machineReducer,
    point: pointReducer
  }
})

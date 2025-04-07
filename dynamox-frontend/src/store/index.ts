import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import machineReducer from "./machines/machineSlice";
import sensorReducer from "./sensors/sensorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machineReducer,
    sensors: sensorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

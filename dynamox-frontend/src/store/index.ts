import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import machineReducer from "./machines/machineSlice";
import sensorReducer from "./sensors/sensorSlice";
import monitoringPointReducer from "./monitoring-point/monitoringPointSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machineReducer,
    sensors: sensorReducer,
    monitoringPoints: monitoringPointReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

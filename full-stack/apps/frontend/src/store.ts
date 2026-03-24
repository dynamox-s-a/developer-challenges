import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import monitoringPointsReducer from "./store/monitoringPointsSlice";
import timeSeriesReducer from "./store/timeSeriesSlice";
import machinesReducer from "./store/machinesSlice";
import monitoringPointsCrudReducer from "./store/monitoringPointsCrudSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    monitoringPoints: monitoringPointsReducer,
    timeSeries: timeSeriesReducer,
    machines: machinesReducer,
    monitoringPointsCrud: monitoringPointsCrudReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
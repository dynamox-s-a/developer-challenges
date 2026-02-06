import { configureStore } from "@reduxjs/toolkit";
import monitoringPointsReducer from "./store/monitoringPointsSlice";

export const store = configureStore({
  reducer: {
    monitoringPoints: monitoringPointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
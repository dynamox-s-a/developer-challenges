import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import monitoringPointsReducer from "./store/monitoringPointsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    monitoringPoints: monitoringPointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
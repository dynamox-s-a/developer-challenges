import { configureStore } from "@reduxjs/toolkit";
import machinesReducer from "@/redux/machinesSlice";
import monitoringPointReducer from "@/redux/monitoringPointSlice";

/**
 * Configures the Redux store with the specified reducers.
 */
export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    monitoringPoint: monitoringPointReducer,
  },
});

/**
 * Type representing the root state of the Redux store.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type representing the dispatch function of the Redux store.
 */
export type AppDispatch = typeof store.dispatch;

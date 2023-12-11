import { Middleware, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import machineReducer from "./machines/machineSlice";
import monitoringPointReducer from "./monitoringPoints/monitoringPointsSlice";
import userReducer from "./users/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    machines: machineReducer,
    monitoringPoints: monitoringPointReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger as Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { Middleware, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import userReducer from "./users/userSlice";
import machineReducer from "./machines/machineSlice";
import monitoringPointReducer from "./monitoringPoints/monitoringPointsSlicer";

const store = configureStore({
  reducer: {
    user: userReducer,
    machine: machineReducer,
    monitoringPoint: monitoringPointReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger as Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

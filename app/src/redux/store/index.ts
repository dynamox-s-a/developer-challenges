import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userSlice";
import machineReducer from "./machines/machineSlice";
import monitoringPointReducer from "./monitoringPoints/monitoringPointsSlicer";

const store = configureStore({
  reducer: {
    user: userReducer,
    machine: machineReducer,
    monitoringPoint: monitoringPointReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

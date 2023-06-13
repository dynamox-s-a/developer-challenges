import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux"; // Import from "redux" instead of "@reduxjs/toolkit"
import machineReducer from "./reducers/machineReducers";

const rootReducer = combineReducers({
  machines: machineReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

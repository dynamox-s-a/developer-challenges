import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import eventsReducer from "./events/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

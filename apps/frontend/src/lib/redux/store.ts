import { configureStore } from "@reduxjs/toolkit";
import sensorsReducer from "./features/sensorsSlice";
import userReducer, { userMiddleware } from "./features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    sensors: sensorsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

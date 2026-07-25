"use client";

import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { dashboardReducer } from "./dashboardSlice";
import { dashboardSaga } from "./dashboardSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(dashboardSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

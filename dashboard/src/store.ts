import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { telemetryReducer } from "./features/telemetry/model/telemetrySlice";
import { telemetrySaga } from "./features/telemetry/model/telemetrySaga";
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: { telemetry: telemetryReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});
sagaMiddleware.run(telemetrySaga);
export type RootState = ReturnType<typeof store.getState>;

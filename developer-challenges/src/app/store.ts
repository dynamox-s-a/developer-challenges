import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import machineDataReducer from "../features/machineData/machineDataSlice";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
	reducer: {
		machineData: machineDataReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

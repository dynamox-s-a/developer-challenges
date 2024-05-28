import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from 'redux-saga'
import measuresSlice from "./slices/measuresSlice";
import measuresSaga from "./sagas/measuresSaga";
import machineSlice from "./slices/machineSlice";
import machineSaga from "./sagas/machineSaga";

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    measures: measuresSlice,
    machinesData: machineSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})
sagaMiddleware.run(measuresSaga)
sagaMiddleware.run(machineSaga)

// useAppSelector = useSelector+Typescript
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// useAppDispatch = useDispatch+Typescript
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch



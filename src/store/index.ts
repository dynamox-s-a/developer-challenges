import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { machineData } from "./slices/machineData";

export const store = configureStore({
  reducer: {
    machineData: machineData.reducer
  }
})

// useAppSelector = useSelector+Typescript
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// useAppDispatch = useDispatch+Typescript
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch



import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import machinesReducer from "@/features/machines/redux/machinesSlice";

const store = configureStore({
  reducer: {
    machines: machinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

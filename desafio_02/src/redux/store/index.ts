import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "../reducers/userInfo";
import headerHandleTitleSlice from "../reducers/headerHandleTitle";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    userInfoSlice,
    headerHandleTitleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

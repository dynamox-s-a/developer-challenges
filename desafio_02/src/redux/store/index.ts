import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userInfoSlice from "../reducers/userInfo";

const store = configureStore({
  reducer: {
    userInfoSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;

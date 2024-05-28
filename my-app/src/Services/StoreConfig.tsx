import { combineReducers, configureStore } from "@reduxjs/toolkit";
import getFlowchart from "./Slices/getFlowchart";
const reducer = combineReducers({
  getFlowchart,
});

export const store = configureStore({ reducer });
export type RootState = ReturnType<typeof store.getState>;
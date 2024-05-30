import { combineReducers, configureStore } from "@reduxjs/toolkit";
import getFlowchart from "./Slices/getFlowchart";
import getMachine from "./Slices/getMachine";
const reducer = combineReducers({
  getFlowchart,
  getMachine
});

export const store = configureStore({ reducer });
export type RootState = ReturnType<typeof store.getState>;
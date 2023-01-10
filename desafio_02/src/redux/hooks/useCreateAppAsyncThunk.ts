import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store";

export const useCreateAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  // extra: { s: string; n: number };
}>();

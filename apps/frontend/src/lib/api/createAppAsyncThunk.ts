/* Core */
import { createAsyncThunk } from "@reduxjs/toolkit";

/* Instruments */
import type { RootState, AppDispatch } from "../redux/store";

/**
 * ? A utility function to create a typed Async Thunk Actions.
 */
const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();


export default createAppAsyncThunk;

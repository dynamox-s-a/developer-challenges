import { createSlice } from '@reduxjs/toolkit';

import { loginUser } from './user-slice';
import {
  addMachine,
  getMachines,
  editMachine,
  deleteMachine,
} from './machines-slice';

type ErrorType = {
  loginUser?: string;
  addMachine?: string;
  getMachines?: string;
  editMachine?: string;
  deleteMachine?: string;
};

const INITIAL_STATE: ErrorType = {
  loginUser: undefined,
  addMachine: undefined,
  getMachines: undefined,
  editMachine: undefined,
  deleteMachine: undefined,
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loginUser = '';
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loginUser = '';
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginUser = action.payload as string;
    });
    builder.addCase(addMachine.fulfilled, (state) => {
      state.addMachine = '';
    });
    builder.addCase(addMachine.pending, (state) => {
      state.addMachine = '';
    });
    builder.addCase(addMachine.rejected, (state, action) => {
      state.addMachine = action.payload as string;
    });
    builder.addCase(getMachines.fulfilled, (state) => {
      state.getMachines = '';
    });
    builder.addCase(getMachines.pending, (state) => {
      state.getMachines = '';
    });
    builder.addCase(getMachines.rejected, (state, action) => {
      state.getMachines = action.payload as string;
    });
    builder.addCase(editMachine.fulfilled, (state) => {
      state.editMachine = '';
    });
    builder.addCase(editMachine.pending, (state) => {
      state.editMachine = '';
    });
    builder.addCase(editMachine.rejected, (state, action) => {
      state.editMachine = action.payload as string;
    });
    builder.addCase(deleteMachine.fulfilled, (state) => {
      state.deleteMachine = '';
    });
    builder.addCase(deleteMachine.pending, (state) => {
      state.deleteMachine = '';
    });
    builder.addCase(deleteMachine.rejected, (state, action) => {
      state.deleteMachine = action.payload as string;
    });
  },
});

export default errorSlice.reducer;

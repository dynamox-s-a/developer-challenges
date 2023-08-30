import { createSlice } from '@reduxjs/toolkit';

import { loginUser } from './user-slice';
import {
  addMachine,
  getMachines,
  editMachine,
  deleteMachine,
} from './machines-slice';
import {
  createMonitoringPoint,
  getMonitoringPoints,
} from './monitoring-points-slice';

type LoadingType = {
  loginUser?: boolean;
  addMachine?: boolean;
  getMachines?: boolean;
  editMachine?: boolean;
  deleteMachine?: boolean;
  createMonitoringPoint?: boolean;
  getMonitoringPoints?: boolean;
};

const INITIAL_STATE: LoadingType = {
  loginUser: undefined,
  addMachine: undefined,
  getMachines: undefined,
  editMachine: undefined,
  deleteMachine: undefined,
  createMonitoringPoint: undefined,
  getMonitoringPoints: undefined,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loginUser = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loginUser = false;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loginUser = true;
    });
    builder.addCase(addMachine.fulfilled, (state) => {
      state.addMachine = false;
    });
    builder.addCase(addMachine.rejected, (state) => {
      state.addMachine = false;
    });
    builder.addCase(addMachine.pending, (state) => {
      state.addMachine = true;
    });
    builder.addCase(getMachines.fulfilled, (state) => {
      state.getMachines = false;
    });
    builder.addCase(getMachines.rejected, (state) => {
      state.getMachines = false;
    });
    builder.addCase(getMachines.pending, (state) => {
      state.getMachines = true;
    });
    builder.addCase(editMachine.fulfilled, (state) => {
      state.editMachine = false;
    });
    builder.addCase(editMachine.rejected, (state) => {
      state.editMachine = false;
    });
    builder.addCase(editMachine.pending, (state) => {
      state.editMachine = true;
    });
    builder.addCase(deleteMachine.fulfilled, (state) => {
      state.deleteMachine = false;
    });
    builder.addCase(deleteMachine.rejected, (state) => {
      state.deleteMachine = false;
    });
    builder.addCase(deleteMachine.pending, (state) => {
      state.deleteMachine = true;
    });
    builder.addCase(createMonitoringPoint.fulfilled, (state) => {
      state.createMonitoringPoint = false;
    });
    builder.addCase(createMonitoringPoint.rejected, (state) => {
      state.createMonitoringPoint = false;
    });
    builder.addCase(createMonitoringPoint.pending, (state) => {
      state.createMonitoringPoint = true;
    });
    builder.addCase(getMonitoringPoints.fulfilled, (state) => {
      state.getMonitoringPoints = false;
    });
    builder.addCase(getMonitoringPoints.rejected, (state) => {
      state.getMonitoringPoints = false;
    });
    builder.addCase(getMonitoringPoints.pending, (state) => {
      state.getMonitoringPoints = true;
    });
  },
});

export default loadingSlice.reducer;

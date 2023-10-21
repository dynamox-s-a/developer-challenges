import { createReducer } from '@reduxjs/toolkit';
import {
  addMachineType,
  deleteMachineType,
  setMachineTypes,
} from "../actions/machineTypesActions";

import { MachineType } from '../../../app/types/types';

const initialMachineTypes: MachineType[] = [];

const machineTypesReducer = createReducer(
  {
    machineTypes: initialMachineTypes,
  },
  (builder) => {
    builder
      .addCase(addMachineType, (state, action) => {
        if (action.payload) {
          state.machineTypes.push(action.payload);
        }
      })
      .addCase(deleteMachineType, (state, action) => {
        state.machineTypes = state.machineTypes.filter(
          (machineType) => machineType.id !== action.payload
        );
      })
      .addCase(setMachineTypes, (state, action) => {
        state.machineTypes = action.payload || [];
      })
  }
);

export default machineTypesReducer;

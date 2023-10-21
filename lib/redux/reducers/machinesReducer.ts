import { createReducer } from '@reduxjs/toolkit';
import {
  addMachine,
  deleteMachine,
  setMachines,
} from '../actions/machinesActions';

import { Machines } from '../../../app/types/types';

const initialMachines: Machines[] = [];

const machinesReducer = createReducer(
  {
    machines: initialMachines,
  },
  (builder) => {
    builder
      .addCase(addMachine, (state, action) => {
        if (action.payload) {
          state.machines.push(action.payload);
        }
      })
      .addCase(deleteMachine, (state, action) => {
        state.machines = state.machines.filter(
          (machine) => machine.id !== action.payload
        );
      })
      .addCase(setMachines, (state, action) => {
        state.machines = action.payload || [];
      });
  }
);

export default machinesReducer;

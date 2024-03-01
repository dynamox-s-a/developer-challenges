import {
  getMachine,
  getMachines,
  deleteMachine,
  createMachine,
  updateMachine as updateMachineApi,
 } from '../../api';
import { Machine } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MachinesSliceState {
  data: Machine[];
  openEditModal: boolean;
  machineSelected: Machine | null;
  status: "ready" | "loading" | "error";
}

const initialState: MachinesSliceState = {
  data: [],
  status: "ready",
  openEditModal: false,
  machineSelected: null,
};

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.data = state.data.concat(action.payload);
    },
    removeMachine: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((sensor) => sensor.id !== action.payload);
    },
    updateMachine: (state, action: PayloadAction<Machine>) => {
      state.data = state.data.map((sensor) => {
        if (sensor.id === action.payload.id) {
          return action.payload;
        }
        return sensor;
      });
    },
    selectMachine: (state, action: PayloadAction<Machine | null>) => {
      state.machineSelected = action.payload;
      state.openEditModal = !state.openEditModal;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMachines.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getMachines.fulfilled, (state, action) => {
      state.status = "ready";
      state.data = action.payload as Machine[];
    });
    builder.addCase(getMachines.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(createMachine.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createMachine.fulfilled, (state, action) => {
      state.data = state.data.concat(action.payload as Machine);
      state.status = "ready";
    });
    builder.addCase(createMachine.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(updateMachineApi.fulfilled, (state, action) => {
      state.data = state.data.map((sensor) => {
        if (sensor.id === (action.payload as Machine).id) {
          return action.payload;
        }
        return sensor;
      }) as Machine[];
      state.status = "ready";
    });
    builder.addCase(updateMachineApi.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateMachineApi.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteMachine.fulfilled, (state, action) => {
      state.data = state.data.filter((sensor) => sensor.id !== action.payload);
      state.status = "ready";
    });
    builder.addCase(deleteMachine.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteMachine.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getMachine.fulfilled, (state, action) => {
      state.status = "ready";
    });
    builder.addCase(getMachine.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(getMachine.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const { addMachine, removeMachine, updateMachine, selectMachine } = machinesSlice.actions;
export default machinesSlice.reducer;

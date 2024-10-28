"use client";
import MachineService from "@/app/services/Machine/MachineService";
import Machine from "@/app/types/Machine";
/* eslint-disable react-hooks/rules-of-hooks */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  machines: Machine[];
  machine: Machine;
}

export const initialState: InitialState = {
  machines: [],
  machine: { name: "", type: "", id: 0 },
};

const slice = createSlice({
  name: "machineReducer",
  initialState,
  reducers: {
    setMachines: (state, action: PayloadAction<Machine[]>) => {
      state.machines = action.payload;
    },
    setMachine: (state, action: PayloadAction<Machine>) => {
      state.machine = action.payload;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export default slice.reducer;
export const { setMachines, setMachine } = slice.actions;

export function getMachines() {
  return async (dispatch: any) => {
    try {
      const response = await MachineService.getAllMachines();
      if (response.status === 200) {
        dispatch(setMachines(response.data.machines));
      } else {
        throw new Error("Failed to get all machines. Verify.");
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };
}

export function getMachineById(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await MachineService.getMachineById(id);
      if (response.status === 200) {
        dispatch(setMachine(response.data.machine));
      } else {
        throw new Error("Failed to get machine. Verify.");
      }
    } catch (error) {
      console.error("Error fetching machine:", error);
    }
  };
}

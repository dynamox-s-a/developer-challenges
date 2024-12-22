import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Machine, Sensor, MonitoringPoint } from "@/types/machines";
import { handleAsyncAction } from "@/utils/asyncSliceHelper";
import * as actionTypes from "@/redux/machines/actionTypes";

/**
 * Defines the state structure for the machines feature.
 * @interface MachinesState
 * @property {Machine[]} machines - Array of machines.
 * @property {boolean} isLoading - Flag indicating if data is being loaded.
 */
export interface MachinesState {
  machines: Machine[];
  sensors: Sensor[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MachinesState = {
  machines: [],
  sensors: [],
  isLoading: false,
  error: null,
};

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    setMachines: (state, action: PayloadAction<Machine[]>) => {
      state.machines = action.payload;
    },
    setSensors: (state, action: PayloadAction<Sensor[]>) => {
      state.sensors = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, actionTypes.FETCH_MACHINES, (state, action) => {
      state.machines = action.payload;
    });

    handleAsyncAction(builder, actionTypes.FETCH_SENSORS, (state, action) => {
      state.sensors = action.payload;
    });

    handleAsyncAction(builder, actionTypes.CREATE_MACHINE, (state, action) => {
      state.machines.push(action.payload);
    });

    handleAsyncAction(builder, actionTypes.UPDATE_MACHINE, (state, action) => {
      const index = state.machines.findIndex(
        (machine: Machine) => machine.id === action.payload.id,
      );
      if (index !== -1) state.machines[index] = action.payload;
    });

    handleAsyncAction(
      builder,
      actionTypes.ADD_MONITORING_POINT,
      (state, action) => {
        const machine = state.machines.find(
          (machine: Machine) => machine.id === action.meta.arg.machineId,
        );
        if (machine) {
          machine.monitoringPoints = [
            ...(machine.monitoringPoints || []),
            action.payload,
          ];
        }
      },
    );

    handleAsyncAction(builder, actionTypes.DELETE_MACHINE, (state, action) => {
      state.machines = state.machines.filter(
        (machine: Machine) => machine.id !== action.meta.arg,
      );
    });

    handleAsyncAction(
      builder,
      actionTypes.DELETE_MONITORING_POINT,
      (state, action) => {
        const machine = state.machines.find(
          (machine: Machine) => machine.id === action.payload.machineId,
        );
        if (machine) {
          machine.monitoringPoints = machine.monitoringPoints?.filter(
            (mp: MonitoringPoint) => mp.id !== action.payload.monitoringPointId,
          );
        }
      },
    );
  },
});

export const { setMachines, setSensors, setError, setLoading } =
  machinesSlice.actions;

export default machinesSlice.reducer;

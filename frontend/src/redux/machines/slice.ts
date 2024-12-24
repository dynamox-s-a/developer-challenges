import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Machine, Sensor, MonitoringPoint } from "@/types/machines";
import { handleAsyncAction } from "@/utils/asyncSliceHelper";
import * as actionTypes from "@/redux/machines/actionTypes";

/**
 * Defines the state structure for the machines feature.
 * @property {Machine[]} machines - Array of machines.
 * @property {Sensor[]} sensors - Array of sensors associated with machines.
 * @property {boolean} isLoading - Flag indicating if data is being loaded.
 * @property {string | null} error - Error message or null if no error.
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
    /**
     * Sets the machines data in the state.
     * @param {MachinesState} state - Current state of the machines feature.
     * @param {PayloadAction<Machine[]>} action - Action containing the list of machines.
     */
    setMachines: (state, action: PayloadAction<Machine[]>) => {
      state.machines = action.payload;
    },

    /**
     * Sets the sensors data in the state.
     * @param {MachinesState} state - Current state of the machines feature.
     * @param {PayloadAction<Sensor[]>} action - Action containing the list of sensors.
     */
    setSensors: (state, action: PayloadAction<Sensor[]>) => {
      state.sensors = action.payload;
    },

    /**
     * Sets an error message in the state.
     * @param {MachinesState} state - Current state of the machines feature.
     * @param {PayloadAction<string | null>} action - Action containing the error message or null.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Sets the loading state.
     * @param {MachinesState} state - Current state of the machines feature.
     * @param {PayloadAction<boolean>} action - Action containing the loading status (true or false).
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    /**
     * Handles async actions for fetching machines, sensors, creating and updating machines,
     * adding and deleting monitoring points.
     * Uses `handleAsyncAction` to handle the corresponding action types.
     */
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

/**
 * Action creators for updating machines state.
 */
export const { setMachines, setSensors, setError, setLoading } =
  machinesSlice.actions;

/**
 * Reducer for handling machines state in the Redux store.
 */
export default machinesSlice.reducer;
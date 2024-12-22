import { Machine, MonitoringPoint, Sensor } from "@/types/machines";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMonitoringPoint,
  createMachineService,
  deleteMachine,
  deleteMonitoringPoint,
  fetchMachinesService,
  fetchSensorsService,
} from "@/services/machines";
import { handleAsyncAction } from "@/utils/asyncSliceHelper";
import * as actionTypes from "@/redux/actionTypes";
import { act } from "react";

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

/**
 * Fetch machines from the API and update the Redux state.
 */
export const fetchMachines = createAsyncThunk<Machine[], void>(
  actionTypes.FETCH_MACHINES,
  async () => {
    const machines = await fetchMachinesService();
    return machines;
  },
);

export const fetchSensors = createAsyncThunk<Sensor[], void>(
  actionTypes.FETCH_SENSORS,
  async () => {
    return await fetchSensorsService();
  },
);
/**
 * Create a machine in the API and update the Redux state.
 */
export const createMachineThunk = createAsyncThunk<Machine, Machine>(
  actionTypes.CREATE_MACHINE,
  async (model) => {
    return await createMachineService(model);
  },
);

export const addMonitoringPointThunk = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; monitoringPoint: MonitoringPoint }
>(actionTypes.ADD_MONITORING_POINT, async ({ machineId, monitoringPoint }) => {
  return await addMonitoringPoint(machineId, monitoringPoint);
});

export const deleteMachineThunk = createAsyncThunk<void, string>(
  actionTypes.DELETE_MACHINE,
  async (machineId) => {
    return await deleteMachine(machineId);
  },
);

export const deleteMonitoringPointThunk = createAsyncThunk(
  "machines/deleteMonitoringPoint",
  async ({
    machineId,
    monitoringPointId,
  }: {
    machineId: string;
    monitoringPointId: string;
  }) => {
    await deleteMonitoringPoint(machineId, monitoringPointId);

    return { machineId, monitoringPointId };
  },
);

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    setMachines: (state, action: PayloadAction<any[]>) => {
      state.machines = action.payload;
    },

    setSensors: (state, action: PayloadAction<any[]>) => {
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

    handleAsyncAction(
      builder,
      actionTypes.ADD_MONITORING_POINT,
      (state, action) => {
        const machine = state.machines.find(
          (m: Machine) => m.id === action.payload.machineId,
        );
        if (machine) {
          machine.monitoringPoints?.push(action.payload);
        }
      },
    );

    handleAsyncAction(builder, actionTypes.DELETE_MACHINE, (state, action) => {
      state.machines = state.machines.filter(
        (machine: Machine) => machine.id !== action.payload,
      );
    });

    handleAsyncAction(
      builder,
      actionTypes.DELETE_MONITORING_POINT,
      (state, action) => {
        const machine = state.machines.find(
          (m: Machine) => m.id === action.payload.machineId,
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

export const { setMachines, setError, setLoading } = machinesSlice.actions;

export default machinesSlice.reducer;

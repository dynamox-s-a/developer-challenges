import { Machine, MonitoringPoint } from "@/types/machines";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Defines the state structure for the machines feature.
 * @interface MachinesState
 * @property {Machine[]} machines - Array of machines.
 * @property {boolean} isLoading - Flag indicating if data is being loaded.
 */
export interface MachinesState {
  machines: Machine[];
  isLoading: boolean;
}

const initialState: MachinesState = {
  machines: [],
  isLoading: false,
};

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    /**
     * Sets the loading state to true.
     * This action is typically dispatched when starting an async request.
     * @param {MachinesState} state - The current state of the machines.
     */
    setLoading: (state) => {
      state.isLoading = true;
    },

    /**
     * Sets the loading state to false.
     * This action is dispatched when an async request is completed.
     * @param {MachinesState} state - The current state of the machines.
     */
    setLoadingDone: (state) => {
      state.isLoading = false;
    },

    /**
     * Adds a new machine to the state.
     * @param {MachinesState} state - The current state of machines.
     * @param {PayloadAction<Machine>} action - The action containing the new machine to add.
     * @returns {void}
     */
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
    },

    /**
     * Deletes a machine from the state by its ID.
     * @param {MachinesState} state - The current state of machines.
     * @param {PayloadAction<string>} action - The action containing the ID of the machine to delete.
     * @returns {void}
     */
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter(
        (machine) => machine.id !== action.payload,
      );
    },

    /**
     * Updates an existing machine in the state.
     * @param {MachinesState} state - The current state of machines.
     * @param {PayloadAction<Machine>} action - The action containing the updated machine data.
     * @returns {void}
     */
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },

    /**
     * Adds a monitoring point to a specific machine in the state.
     * @param {MachinesState} state - The current state of machines.
     * @param {PayloadAction<{ machineId: string; monitoringPoint: MonitoringPoint }>} action - 
     * An object containing the machine ID and the monitoring point to add.
     * @returns {void}
     */
    addMonitoringPointToMachine: (
      state,
      action: PayloadAction<{
        machineId: string;
        monitoringPoint: MonitoringPoint;
      }>,
    ) => {
      const { machineId, monitoringPoint } = action.payload;
      const machine = state.machines.find((m) => m.id === machineId);
      if (machine) {
        machine.monitoringPoints = [
          ...(machine.monitoringPoints || []),
          monitoringPoint,
        ];
      }
    },

    /**
     * Deletes a monitoring point from a specific machine in the state.
     * @param {MachinesState} state - The current state of machines.
     * @param {PayloadAction<{ machineId: string; monitoringPointId: string }>} action - 
     * An object containing the machine ID and the monitoring point ID to delete.
     * @returns {void}
     */
    deleteMonitoringPoint: (
      state,
      action: PayloadAction<{ machineId: string; monitoringPointId: string }>,
    ) => {
      const { machineId, monitoringPointId } = action.payload;
      const machine = state.machines.find((m) => m.id === machineId);
      if (machine) {
        machine.monitoringPoints = machine.monitoringPoints.filter(
          (mp) => mp.id !== monitoringPointId,
        );
      }
    },
  },
});

export const {
  addMachine,
  deleteMachine,
  updateMachine,
  addMonitoringPointToMachine,
  deleteMonitoringPoint,
  setLoading,
  setLoadingDone,
} = machinesSlice.actions;

export default machinesSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Sensor {
  id: string;
  model: "TcAg" | "TcAs" | "HF+";
}

interface MonitoringPoint {
  id: string;
  name: string;
  sensor: Sensor | null;
}

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: MonitoringPoint[];
}

interface MachinesState {
  machines: Machine[];
}

const initialState: MachinesState = {
  machines: [],
};

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
    },
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter((m) => m.id !== action.payload);
    },
    addMonitoringPoint: (
      state,
      action: PayloadAction<{
        machineId: string;
        monitoringPoint: MonitoringPoint;
      }>,
    ) => {
      const machine = state.machines.find(
        (m) => m.id === action.payload.machineId,
      );
      if (machine) {
        machine.monitoringPoints.push(action.payload.monitoringPoint);
      }
    },
    addSensor: (
      state,
      action: PayloadAction<{
        machineId: string;
        monitoringPointId: string;
        sensor: Sensor;
      }>,
    ) => {
      const machine = state.machines.find(
        (m) => m.id === action.payload.machineId,
      );
      if (machine) {
        const monitoringPoint = machine.monitoringPoints.find(
          (mp) => mp.id === action.payload.monitoringPointId,
        );
        if (monitoringPoint) {
          if (
            machine.type === "Pump" &&
            (action.payload.sensor.model === "TcAg" ||
              action.payload.sensor.model === "TcAs")
          ) {
            throw new Error(
              "TcAg and TcAs sensors cannot be used with Pump machines.",
            );
          }
          monitoringPoint.sensor = action.payload.sensor;
        }
      }
    },
    deleteMonitoringPoint: (
      state,
      action: PayloadAction<{ machineId: string; monitoringPointId: string }>,
    ) => {
      const machine = state.machines.find(
        (m) => m.id === action.payload.machineId,
      );
      if (machine) {
        machine.monitoringPoints = machine.monitoringPoints.filter(
          (mp) => mp.id !== action.payload.monitoringPointId,
        );
      }
    },
  },
});

export const {
  addMachine,
  updateMachine,
  deleteMachine,
  addMonitoringPoint,
  addSensor,
  deleteMonitoringPoint,
} = machinesSlice.actions;

export default machinesSlice.reducer;

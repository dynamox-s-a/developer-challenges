import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export interface Machine {
  id: string;
  name: string;
  type: 'Pump' | 'Fan';
}

export interface MonitoringPoint {
  id: string;
  machineId: string;
  name: string;
  sensorModel?: 'TcAg' | 'TcAs' | 'HF+';
}

interface MachinesState {
  machines: Machine[];
  monitoringPoints: MonitoringPoint[];
  loading: boolean;
  error: string | null;
}

const initialState: MachinesState = {
  machines: [],
  monitoringPoints: [],
  loading: false,
  error: null,
};

// Simular API calls
const fakeApi = {
  addMachine: (machine: Machine): Promise<Machine> =>
    new Promise((resolve) => setTimeout(() => resolve(machine), 500)),

  updateMachine: (machine: Machine): Promise<Machine> =>
    new Promise((resolve) => setTimeout(() => resolve(machine), 500)),

  deleteMachine: (id: string): Promise<string> =>
    new Promise((resolve) => setTimeout(() => resolve(id), 300)),

  addMonitoringPoint: (mp: MonitoringPoint): Promise<MonitoringPoint> =>
    new Promise((resolve) => setTimeout(() => resolve(mp), 500)),
};

// ASYNC THUNKS
export const addMachineAsync = createAsyncThunk(
  'machines/addMachineAsync',
  async (machineData: Omit<Machine, 'id'>) => {
    const machineWithId = { ...machineData, id: Date.now().toString() };
    const response = await fakeApi.addMachine(machineWithId);
    return response;
  }
);

export const updateMachineAsync = createAsyncThunk(
  'machines/updateMachineAsync',
  async (machine: Machine) => {
    const response = await fakeApi.updateMachine(machine);
    return response;
  }
);

export const deleteMachineAsync = createAsyncThunk(
  'machines/deleteMachineAsync',
  async (id: string) => {
    await fakeApi.deleteMachine(id);
    return id;
  }
);

export const addMonitoringPointAsync = createAsyncThunk(
  'machines/addMonitoringPointAsync',
  async (monitoringPointData: Omit<MonitoringPoint, 'id'>) => {
    const mpWithId = { ...monitoringPointData, id: Date.now().toString() };
    const response = await fakeApi.addMonitoringPoint(mpWithId);
    return response;
  }
);

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addMachineAsync
      .addCase(addMachineAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMachineAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.machines.push(action.payload);
      })
      .addCase(addMachineAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add machine';
      })

      // updateMachineAsync
      .addCase(updateMachineAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachineAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.machines.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.machines[index] = action.payload;
        }
      })
      .addCase(updateMachineAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update machine';
      })

      // deleteMachineAsync
      .addCase(deleteMachineAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMachineAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = state.machines.filter(m => m.id !== action.payload);
        // Remove monitoring points associados
        state.monitoringPoints = state.monitoringPoints.filter(mp => mp.machineId !== action.payload);
      })
      .addCase(deleteMachineAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete machine';
      })

      // addMonitoringPointAsync
      .addCase(addMonitoringPointAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMonitoringPointAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.monitoringPoints.push(action.payload);
      })
      .addCase(addMonitoringPointAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add monitoring point';
      });
  },
});

export const { clearError } = machinesSlice.actions;
export default machinesSlice.reducer;

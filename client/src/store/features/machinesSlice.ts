// store/features/machinesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export interface Machine {
    id: string;
    name: string;
    type: 'pump' | 'fan';
    monitoringPoints: MonitoringPoint[];
}

export interface MonitoringPoint {
    id: string;
    monitoringPointName: string;
    sensorType: SensorType;
}

export const sensorTypes = {
    TcAg: 'TcAg',
    TcAS: 'TcAS',
    HF: 'HF+',
} as const;

export type SensorType = typeof sensorTypes[keyof typeof sensorTypes];

interface MachinesState {
    list: Machine[];
    loading: boolean;
    error: string | null;
}

// Async thunk
export const fetchMachines = createAsyncThunk<Machine[]>(
    'machines/fetchMachines',
    async () => {
        const response = await fetch(`${SERVER_BASE_URL}/api/machines`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to fetch machines');
        return await response.json();
    }
);

export const createMachine = createAsyncThunk<
    { id: string },
    { name: string; type: 'pump' | 'fan' }
>(
    'machines/createMachine',
    async ({ name, type }) => {
        const response = await fetch(`${SERVER_BASE_URL}/api/machines`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, type }),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to create machine');
        return await response.json();
    }
);

export const deleteMachineAsync = createAsyncThunk<
    { id: string },
    string
>(
    'machines/deleteMachine',
    async (machineId) => {
        const response = await fetch(`${SERVER_BASE_URL}/api/machines/${machineId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete machine');
        return { id: machineId };
    }
);

export const updateMachineTypeAsync = createAsyncThunk<
    { machine: Machine },
    { id: string; type: 'pump' | 'fan' }
>(
    'machines/updateMachineType',
    async ({ id, type }) => {
        const response = await fetch(`${SERVER_BASE_URL}/api/machines/${id}/type`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type }),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to update machine type');
        const data = await response.json();
        return { machine: data.machine };
    }
);

const initialState: MachinesState = {
    list: [
        { id: 'USR-010', name: 'Pump Alpha Romeo', type: 'pump', monitoringPoints: [] },
        {
            id: 'USR-009', name: 'Cooling Beta', type: 'fan', monitoringPoints: [
                { id: 'USR-009-001', monitoringPointName: 'Temperature', sensorType: 'TcAg' },
                { id: 'USR-009-002', monitoringPointName: 'Humidity', sensorType: 'TcAS' },
                { id: 'USR-009-003', monitoringPointName: 'Pressure', sensorType: 'HF+' },
            ]
        },
        {
            id: 'USR-008', name: 'Industrial Gamma', type: 'pump', monitoringPoints: [
                { id: 'USR-008-004', monitoringPointName: 'Temperature', sensorType: 'TcAg' },
                { id: 'USR-008-005', monitoringPointName: 'Humidity', sensorType: 'TcAS' },
                { id: 'USR-008-006', monitoringPointName: 'Pressure', sensorType: 'HF+' },
                { id: 'USR-008-007', monitoringPointName: 'Level', sensorType: 'HF+' },
                { id: 'USR-008-008', monitoringPointName: 'Flow', sensorType: 'HF+' },
            ]
        },
    ],
    loading: false,
    error: null,
};

const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {
        addMachine: (state, action: PayloadAction<Machine>) => {
            state.list.unshift(action.payload);
        },
        deleteMachine: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter((machine) => machine.id !== action.payload);
        },
        addMonitoringPoint: (state, action: PayloadAction<{ machineId: string; monitoringPoint: MonitoringPoint }>) => {
            const machine = state.list.find((machine) => machine.id === action.payload.machineId);
            if (machine) {
                machine.monitoringPoints.push(action.payload.monitoringPoint);
            }
        },
        updateMachine: (state, action: PayloadAction<{ id: string; name?: string; type?: 'pump' | 'fan' }>) => {
            const machine = state.list.find((machine) => machine.id === action.payload.id);
            if (machine) {
                if (action.payload.name) machine.name = action.payload.name;
                if (action.payload.type) {
                    machine.type = action.payload.type;
                    // Clear monitoring points when machine type changes since different types have different sensor types
                    machine.monitoringPoints = [];
                }
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMachines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMachines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            })
            .addCase(createMachine.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMachine.fulfilled, (state, action) => {
                state.loading = false;
                // After successful creation, refetch machines to get the updated list
                // The server returns { id } but we need the full machine data
            })
            .addCase(createMachine.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            })
            // Delete machine
            .addCase(deleteMachineAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMachineAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(machine => machine.id !== action.payload.id);
            })
            .addCase(deleteMachineAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            })
            // Update machine type
            .addCase(updateMachineTypeAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMachineTypeAsync.fulfilled, (state, action) => {
                state.loading = false;
                const machine = state.list.find(m => m.id === action.payload.machine.id);
                if (machine) {
                    machine.type = action.payload.machine.type;
                    machine.monitoringPoints = []; // Clear monitoring points
                }
            })
            .addCase(updateMachineTypeAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            });
    }
});

export const { addMachine, deleteMachine, updateMachine, addMonitoringPoint } = machinesSlice.actions;
export default machinesSlice.reducer;

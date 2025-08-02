// store/features/monitoringPointsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SensorType } from './machinesSlice';

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Server expects these enum keys, not the mapped values
export const serverSensorTypes = {
    TcAg: 'TcAg',
    TcAs: 'TcAs',
} as const;

export interface MonitoringPoint {
    id?: string; // May not be present in server response
    name: string;
    sensorType: SensorType;
    machineId: string;
    sensorId: string;
    userId: string;
}

interface MonitoringPointsState {
    list: MonitoringPoint[];
    loading: boolean;
    error: string | null;
}

// Async thunk to fetch monitoring points
export const fetchMonitoringPoints = createAsyncThunk<MonitoringPoint[]>(
    'monitoringPoints/fetchMonitoringPoints',
    async () => {
        const response = await fetch(`${SERVER_BASE_URL}/api/monitoring-points`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to fetch monitoring points');
        return await response.json();
    }
);

// Async thunk to create a monitoring point
export const createMonitoringPoint = createAsyncThunk<
    { id: string },
    { name: string; sensorType: string; machineId: string }
>(
    'monitoringPoints/createMonitoringPoint',
    async ({ name, sensorType, machineId }) => {
        // Map the display sensor type to the server expected format
        let serverSensorType = sensorType;
        if (sensorType === 'TcAg' || sensorType === 'temperature') {
            serverSensorType = 'TcAg';
        } else if (sensorType === 'TcAs' || sensorType === 'humidity') {
            serverSensorType = 'TcAs';
        }

        const response = await fetch(`${SERVER_BASE_URL}/api/monitoring-points`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, sensorType: serverSensorType, machineId }),
            credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to create monitoring point');
        return await response.json();
    }
);

// Async thunk to delete a monitoring point by sensor ID
export const deleteMonitoringPointBySensorId = createAsyncThunk<
    { sensorId: string },
    string
>(
    'monitoringPoints/deleteMonitoringPointBySensorId',
    async (sensorId) => {
        const response = await fetch(`${SERVER_BASE_URL}/api/monitoring-points/sensor-id/${sensorId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to delete monitoring point');
        return { sensorId };
    }
);

// Async thunk to delete all monitoring points by machine ID
export const deleteMonitoringPointsByMachineId = createAsyncThunk<
    { machineId: string },
    string
>(
    'monitoringPoints/deleteMonitoringPointsByMachineId',
    async (machineId) => {
        const response = await fetch(`${SERVER_BASE_URL}/api/monitoring-points/machine-id/${machineId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to delete monitoring points');
        return { machineId };
    }
);

const initialState: MonitoringPointsState = {
    list: [],
    loading: false,
    error: null,
};

const monitoringPointsSlice = createSlice({
    name: 'monitoringPoints',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch monitoring points
            .addCase(fetchMonitoringPoints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMonitoringPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch monitoring points';
            })
            // Create monitoring point
            .addCase(createMonitoringPoint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMonitoringPoint.fulfilled, (state) => {
                state.loading = false;
                // After successful creation, we should refetch the monitoring points
                // The actual monitoring point data will be added when fetchMonitoringPoints is called
            })
            .addCase(createMonitoringPoint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create monitoring point';
            })
            // Delete monitoring point by sensor ID
            .addCase(deleteMonitoringPointBySensorId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMonitoringPointBySensorId.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(point => point.sensorId !== action.payload.sensorId);
            })
            .addCase(deleteMonitoringPointBySensorId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete monitoring point';
            })
            // Delete monitoring points by machine ID
            .addCase(deleteMonitoringPointsByMachineId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMonitoringPointsByMachineId.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(point => point.machineId !== action.payload.machineId);
            })
            .addCase(deleteMonitoringPointsByMachineId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete monitoring points';
            });
    },
});

export const { clearError } = monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;
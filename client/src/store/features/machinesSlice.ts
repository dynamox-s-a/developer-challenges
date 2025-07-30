// store/features/machinesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Machine {
    id: string;
    name: string;
    type: string;
}

interface MachinesState {
    list: Machine[];
    loading: boolean;
    error: string | null;
}

// Async thunk
export const fetchMachines = createAsyncThunk<Machine[]>(
    'machines/fetchMachines',
    async () => {
        const response = await fetch('/api/machines');
        if (!response.ok) throw new Error('Failed to fetch machines');
        return await response.json();
    }
);

const initialState: MachinesState = {
    list: [
        { id: 'USR-010', name: 'Pump Alpha Romeo', type: 'pump' },
        { id: 'USR-009', name: 'Cooling Beta', type: 'fan' },
        { id: 'USR-008', name: 'Industrial Gamma', type: 'pump' },
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
            });
    },
});

export const { addMachine, deleteMachine } = machinesSlice.actions;
export default machinesSlice.reducer;

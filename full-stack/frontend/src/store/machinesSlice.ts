import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {api} from "@/src/utils/apiClient";

export interface Machine {
    id?: string;
    name: string;
    type: string;
}

interface MachinesState {
    machines: Machine[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MachinesState = {
    machines: [],
    status: 'idle',
    error: null,
};

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
    const response = await api.get('/machines');
    return response.data;
});

export const createMachine = createAsyncThunk(
    'machines/createMachine',
    async (newMachine: Machine) => {
        const response = await api.post('/machines', newMachine);
        return response.data; // Se o servidor retornar os dados atualizados da máquina
    }
);

export const updateMachine = createAsyncThunk(
    'machines/updateMachine',
    async (updatedMachine: Machine) => {
        const response = await api.patch(`/machines/${updatedMachine.id}`, updatedMachine);
        return response.data; // Se o servidor retornar os dados atualizados da máquina
    }
);

export const deleteMachine = createAsyncThunk(
    'machines/deleteMachine',
    async (machineId: string) => {
        await api.delete(`/machines/${machineId}`);
        return machineId; // Retorna o ID da máquina deletada
    }
);

const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {
        machineAdded: (state, action) => {
            state.machines.push(action.payload);
        },
        machineUpdated: (state, action) => {
            const index = state.machines.findIndex(machine => machine.id === action.payload.id);
            if (index >= 0) {
                state.machines[index] = action.payload;
            }
        },
        machineDeleted: (state, action) => {
            state.machines = state.machines.filter(machine => machine.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMachines.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.machines = action.payload;
            })
            .addCase(fetchMachines.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            })
            .addCase(createMachine.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createMachine.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.machines.push(action.payload); // Adiciona a nova máquina ao estado Redux
            })
            .addCase(createMachine.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            })
            .addCase(updateMachine.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateMachine.fulfilled, (state, action) => {
                state.status = 'succeeded';

                const index = state.machines.findIndex(machine => machine.id === action.payload.id);
                if (index >= 0) {
                    state.machines[index] = action.payload;
                }
            })
            .addCase(updateMachine.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            })
            // Adicionando os cases para deleteMachine
            .addCase(deleteMachine.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteMachine.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.machines = state.machines.filter(machine => machine.id !== String(action.payload));
            })
            .addCase(deleteMachine.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            });
    },
});

export const { machineAdded, machineUpdated, machineDeleted } = machinesSlice.actions;

export default machinesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Machine {
    id: string,
    name: string,
    type: 'Pump' | 'Fan';
}

interface MachinesState {
    list: Machine[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MachinesState = {
    list: [],
    status: 'idle',
    error: null,
};

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
    const response = await axios.get('http://localhost:3000/machines');
    return response.data;
});

export const addMachine = createAsyncThunk('machines/addMachine', async (newMachine: Omit<Machine, 'id'>) => {
    const response = await axios.post('http://localhost:3000/machines', newMachine);
    return response.data;
});

export const updateMachine = createAsyncThunk('machines/updateMachine', async (updateMachine: Machine) => {
    const response = await axios.put(`http://localhost:3000/machines/${updateMachine.id}`, updateMachine);
    return response.data;
});

export const deleteMachine = createAsyncThunk('machines/deleteMachine', async (machineId: string) => {
    await axios.delete(`http://localhost:3000/machines/${machineId}`);
    return machineId;
});

const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMachines.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchMachines.rejected, (state, action)=> {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch machines';
            })
            .addCase(addMachine.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateMachine.fulfilled, (state, action) => {
                const index = state.list.findIndex(machine => machine.id === action.payload.id);    
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteMachine.fulfilled, (state, action) => {
                state.list = state.list.filter(machine => machine.id !== action.payload);
            });
        
        }
});

export default machinesSlice.reducer;
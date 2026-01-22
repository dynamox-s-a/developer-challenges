import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export interface Machine {
    id: number;
    name: string;
    type: 'Pump' | 'Fan';
    user_id: number;
    monitoring_points?: {
        id: number;
        name: string;
        sensor?: {
            id: string;
            model: string;
        } | null;
    }[];
}

export const fetchAllMachines = createAsyncThunk('machines/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/machines'); 
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Erro ao buscar maquinas');
  }
});

export const createMachine = createAsyncThunk('machines/create', async (data: { name: string, type: string }, { rejectWithValue }) => {
    try {
        const response = await api.post('/machines', data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.detail || 'Erro ao criar maquina');
    }
});

export const updateMachine = createAsyncThunk('machines/update', async ({ id, name, type }: { id: number, name: string, type: string }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/machines/${id}`, { name, type });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.detail || 'Erro ao atualizar maquina');
    }
});

export const deleteMachine = createAsyncThunk('machines/delete', async (id: number, { rejectWithValue }) => {
    try {
        await api.delete(`/machines/${id}`);
        return id;
    } catch (error:any ) {
        return rejectWithValue(error.response?.data?.detail || 'Erro ao deletar maquina')
    }
})

const machineSlice = createSlice({
    name: 'machines',
    initialState: { items: [] as Machine[], loading: false, error: null as string | null },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllMachines.fulfilled, (state, action) => { state.items = action.payload; })
        .addCase(createMachine.fulfilled, (state, action) => { state.items.push(action.payload); })
        .addCase(updateMachine.fulfilled, (state, action) => {
            const index = state.items.findIndex(m=> m.id === action.payload.id);
            if (index !== -1) state.items[index] = action.payload;
        })
        .addCase(deleteMachine.fulfilled, (state, action) => {
            state.items = state.items.filter(m => m.id !== action.payload);
        });
    }
});

export default machineSlice.reducer;

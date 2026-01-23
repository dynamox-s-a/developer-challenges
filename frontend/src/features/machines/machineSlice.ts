import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { addAsyncHandlers } from "../../utils/redux.utils";

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
    initialState: { 
        items: [] as Machine[],
        loading: false,
        error: null as string | null,
        initialLoad: true },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        addAsyncHandlers(builder, fetchAllMachines, {
            onFulfilled: (state, action) => {
                state.items = action.payload;
                state.initialLoad = false;
            },
            onRejected: (state) => {
                state.initialLoad = false;
            }
        });

        addAsyncHandlers(builder, createMachine, {
            onFulfilled: (state, action) => {
                state.items.push(action.payload);
            }
        });

        addAsyncHandlers(builder, updateMachine, {
            onFulfilled: (state, action) => {
                const index = state.items.findIndex(m => m.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            }
        });

        addAsyncHandlers(builder, deleteMachine, {
            onFulfilled: (state, action) => {
                state.items = state.items.filter(m => m.id !== action.payload);
            }
        });
    }
});

export const { clearError } = machineSlice.actions;
export default machineSlice.reducer;

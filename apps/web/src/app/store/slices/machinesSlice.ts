import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import type { Machine } from '@/app/types';

interface MachinesState {
  items: Machine[];
  loading: boolean;
  error: string | null;
}

const initialState: MachinesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMachines = createAsyncThunk(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/machines');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch machines');
    }
  }
);

export const createMachine = createAsyncThunk(
  'machines/create',
  async (data: { name: string; type: 'Pump' | 'Fan' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/machines', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create machine');
    }
  }
);

export const updateMachine = createAsyncThunk(
  'machines/update',
  async ({ id, data }: { id: string; data: { name?: string; type?: 'Pump' | 'Fan' } }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/machines/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update machine');
    }
  }
);

export const deleteMachine = createAsyncThunk(
  'machines/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/machines/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete machine');
    }
  }
);

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action: PayloadAction<Machine[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMachine.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default machinesSlice.reducer;

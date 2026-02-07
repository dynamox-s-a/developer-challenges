import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import type { Sensor } from '@/app/types';

interface SensorsState {
  items: Sensor[];
  loading: boolean;
  error: string | null;
}

const initialState: SensorsState = {
  items: [],
  loading: false,
  error: null,
};

export const createSensor = createAsyncThunk(
  'sensors/create',
  async (data: { model: 'TcAg' | 'TcAs' | 'HF+'; monitoringPointId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/sensors', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sensor');
    }
  }
);

export const updateSensor = createAsyncThunk(
  'sensors/update',
  async ({ id, data }: { id: string; data: { model?: 'TcAg' | 'TcAs' | 'HF+' } }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/sensors/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update sensor');
    }
  }
);

export const deleteSensor = createAsyncThunk(
  'sensors/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/sensors/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete sensor');
    }
  }
);

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSensor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSensor.fulfilled, (state, action) => {
        state.loading = false;
        // We don't really need to store items here if we rely on monitoring points list to show sensors
      })
      .addCase(createSensor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSensor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sensorsSlice.reducer;

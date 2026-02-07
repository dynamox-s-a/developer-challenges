import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import type { TimeSeriesPoint } from '@/app/types';

interface PredictionResult {
  sensorId: string;
  predictedValue: number;
  nextTimestamp: string;
  confidence: string;
}

interface TimeSeriesState {
  data: TimeSeriesPoint[];
  prediction: PredictionResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: TimeSeriesState = {
  data: [],
  prediction: null,
  loading: false,
  error: null,
};

export const fetchPrediction = createAsyncThunk(
  'timeSeries/predict',
  async (sensorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<PredictionResult>('/time-series/prediction', { params: { sensorId } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to predict next value');
    }
  }
);

export const fetchTimeSeries = createAsyncThunk(
  'timeSeries/fetch',
  async (sensorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<TimeSeriesPoint[]>('/time-series', { params: { sensorId } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch time series data');
    }
  }
);

export const createTimeSeriesData = createAsyncThunk(
  'timeSeries/create',
  async (data: { sensorId: string; value: number; timestamp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<TimeSeriesPoint>('/time-series', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to store time series data');
    }
  }
);

export const deleteTimeSeriesData = createAsyncThunk(
  'timeSeries/delete',
  async (sensorId: string, { rejectWithValue }) => {
    try {
      await api.delete('/time-series', { params: { sensorId } });
      return sensorId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete time series data');
    }
  }
);

const timeSeriesSlice = createSlice({
  name: 'timeSeries',
  initialState,
  reducers: {
    clearTimeSeries: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTimeSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTimeSeriesData.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(createTimeSeriesData.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTimeSeriesData.fulfilled, (state) => {
        state.data = [];
        state.error = null;
      })
      .addCase(deleteTimeSeriesData.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.prediction = null;
      })
      .addCase(fetchPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTimeSeries } = timeSeriesSlice.actions;
export default timeSeriesSlice.reducer;

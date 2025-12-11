import { createSlice, createAsyncThunk ,PayloadAction } from '@reduxjs/toolkit';
import { api, PointData } from '../services/api';

export type SensorModel = 'TcAg' | 'TcAs' | 'HF+';

export interface Point {
  id: string;
  name: string;
  machineId: string;
  sensorModel: SensorModel;
  status: 'active' | 'archived';
}

interface PointsState {
  points: Point[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PointsState = {
  points: [
    { id: 'p1', name: 'Vibração Eixo X', machineId: 'm2', sensorModel: 'TcAg', status: 'active' },
    { id: 'p2', name: 'Acelerômetro HF', machineId: 'm1', sensorModel: 'HF+', status: 'active' },
  ],
  status: 'idle',
  error: null,
};

export const fetchPoints = createAsyncThunk('points/fetchPoints', async () => {
  const response = await api.get<Point[]>('/points');
  return response.data.map(p => ({...p, status: p.status || 'active' }));
});

export const addPoint = createAsyncThunk('points/addPoint', async (newPoint: Omit<Point, 'id'>) => {
  const response = await api.post<Point>('/points', newPoint);
  return { ...response.data, status: response.data.status || 'active' };
});

export const updatePoint = createAsyncThunk('points/updatePoint', async (updatedPoint: Point) => {
  const { id, ...data } = updatedPoint;
  const response = await api.patch<Point>(`/points/${updatedPoint.id}`, data);
  return { ...response.data, status: response.data.status || 'active' };
});

export const deletePoint = createAsyncThunk('points/deletePoint', async (pointId: string) => {
  await api.delete(`/points/${pointId}`);
  return pointId;
});

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.points = action.payload;
      })
      .addCase(addPoint.fulfilled, (state, action) => {
        state.points.push(action.payload);
      })
      .addCase(updatePoint.fulfilled, (state, action) => {
        const index = state.points.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.points[index] = action.payload;
        }
      })
      .addCase(deletePoint.fulfilled, (state, action) => {
        state.points = state.points.filter((p) => p.id !== action.payload);
      });
  },
});

export default pointsSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: PointsState = {
  points: [
    { id: 'p1', name: 'Vibração Eixo X', machineId: 'm2', sensorModel: 'TcAg', status: 'active' },
    { id: 'p2', name: 'Acelerômetro HF', machineId: 'm1', sensorModel: 'HF+', status: 'active' },
  ],
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<Point>) => {
      state.points.push(action.payload);
    },
    updatePoint: (state, action: PayloadAction<Point>) => {
      const index = state.points.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.points[index] = action.payload;
      }
    },
    deletePoint: (state, action: PayloadAction<string>) => {
      state.points = state.points.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPoint, updatePoint, deletePoint } = pointsSlice.actions;
export default pointsSlice.reducer;
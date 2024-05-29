import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TemperaturePoint {
  datetime: string;
  max: number;
}

interface TemperatureState {
  data: TemperaturePoint[];
  loading: boolean;
  error: string | null;
}

const initialState: TemperatureState = {
  data: [],
  loading: false,
  error: null,
};

const temperatureSlice = createSlice({
  name: 'temperature',
  initialState,
  reducers: {
    fetchTemperatureRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTemperatureSuccess(state, action: PayloadAction<TemperaturePoint[]>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTemperatureFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchTemperatureRequest, fetchTemperatureSuccess, fetchTemperatureFailure } = temperatureSlice.actions;

export default temperatureSlice.reducer;

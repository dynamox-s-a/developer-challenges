import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VelocityRmsData } from '../../types';

interface VelocityRmsState {
  xData: VelocityRmsData[];
  yData: VelocityRmsData[];
  zData: VelocityRmsData[];
  loading: boolean;
  error: string | null;
}

const initialState: VelocityRmsState = {
  xData: [],
  yData: [],
  zData: [],
  loading: false,
  error: null,
};

const velocityRmsSlice = createSlice({
  name: 'velocityRms',
  initialState,
  reducers: {
    fetchVelocityRmsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVelocityRmsXSuccess: (state, action: PayloadAction<VelocityRmsData[]>) => {
      state.loading = false;
      state.xData = action.payload;
    },
    fetchVelocityRmsYSuccess: (state, action: PayloadAction<VelocityRmsData[]>) => {
      state.loading = false;
      state.yData = action.payload;
    },
    fetchVelocityRmsZSuccess: (state, action: PayloadAction<VelocityRmsData[]>) => {
      state.loading = false;
      state.zData = action.payload;
    },
    fetchVelocityRmsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchVelocityRmsRequest,
  fetchVelocityRmsXSuccess,
  fetchVelocityRmsYSuccess,
  fetchVelocityRmsZSuccess,
  fetchVelocityRmsFailure,
} = velocityRmsSlice.actions;

export default velocityRmsSlice.reducer;

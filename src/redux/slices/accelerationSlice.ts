import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccelerationPoint {
  datetime: string;
  max: number;
}

interface AccelerationState {
  xData: AccelerationPoint[];
  yData: AccelerationPoint[];
  zData: AccelerationPoint[];
  loading: boolean;
  error: string | null;
}

const initialState: AccelerationState = {
  xData: [],
  yData: [],
  zData: [],
  loading: false,
  error: null,
};

const accelerationSlice = createSlice({
  name: 'acceleration',
  initialState,
  reducers: {
    fetchAccelerationRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAccelerationXSuccess(state, action: PayloadAction<AccelerationPoint[]>) {
      state.xData = action.payload;
      state.loading = false;
    },
    fetchAccelerationYSuccess(state, action: PayloadAction<AccelerationPoint[]>) {
      state.yData = action.payload;
      state.loading = false;
    },
    fetchAccelerationZSuccess(state, action: PayloadAction<AccelerationPoint[]>) {
      state.zData = action.payload;
      state.loading = false;
    },
    fetchAccelerationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAccelerationRequest,
  fetchAccelerationXSuccess,
  fetchAccelerationYSuccess,
  fetchAccelerationZSuccess,
  fetchAccelerationFailure,
} = accelerationSlice.actions;

export default accelerationSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Machine } from '../../services/api';

interface MachinesState {
  data: Machine[];
  loading: boolean;
  error: string | null;
}

const initialState: MachinesState = {
  data: [],
  loading: false,
  error: null,
};

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    fetchMachinesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMachinesSuccess(state, action: PayloadAction<Machine[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchMachinesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMachinesStart, fetchMachinesSuccess, fetchMachinesFailure } = machinesSlice.actions;
export default machinesSlice.reducer;
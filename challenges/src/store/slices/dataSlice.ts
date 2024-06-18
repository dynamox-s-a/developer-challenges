import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface DataEntry {
  datetime: string;
  max: number;
}

interface DataItem {
  name: string;
  data: DataEntry[];
}

interface DataState {
  items: DataItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<DataItem[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;
export default dataSlice.reducer;

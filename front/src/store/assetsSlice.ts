import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Asset {
  id: number;
  name: string;
  type: string;
}

interface AssetsState {
  assets: Asset[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AssetsState = {
  assets: [],
  status: 'idle',
  error: null,
};

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
  const response = await fetch('http://localhost:3001/asset/show');
  if (!response.ok) {
    throw new Error('Failed to fetch assets');
  }
  const data = await response.json();
  return data.assets;
});


const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default assetsSlice.reducer;

export type AssetsStateType = AssetsState;

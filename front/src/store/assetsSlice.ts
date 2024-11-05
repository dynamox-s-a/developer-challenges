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

export const addAsset = createAsyncThunk(
  'assets/addAsset',
  async (newAsset: { name: string; type: string }) => {
    const response = await fetch('http://localhost:3001/asset/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAsset),
    });
    return response.json();
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (id: string, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:3001/asset/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      return rejectWithValue('Failed to delete asset');
    }
    return id;
  }
);
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
      })
      .addCase(addAsset.fulfilled, (state, action) => {
        state.assets.push(action.payload);
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.deletingStatus = 'succeeded';
        state.assets = state.assets.filter((asset) => asset.id !== action.payload);
      })
      .addCase(deleteAsset.rejected, (state, action) => {
        state.deletingStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default assetsSlice.reducer;

export type AssetsStateType = AssetsState;

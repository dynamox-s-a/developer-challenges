import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export interface Point {
  id: string;
  name: string;
  machineId: string;
  machine?: { name: string; type: string };
  sensor?: { id: string; model: string };
}

interface PointsState {
  items: Point[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PointsState = {
  items: [],
  status: 'idle',
  error: null,
};

// Buscar todos os pontos
export const fetchPoints = createAsyncThunk('points/fetchPoints', async () => {
  const response = await api.get('/points');
  return response.data;
});

// Criar um novo ponto
export const createPoint = createAsyncThunk('points/createPoint', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/points', data);
    return response.data;
  } catch (err: any) {
    // Captura o erro e retorna a mensagem
    return rejectWithValue(err.response?.data?.message || 'Erro ao criar');
  }
});

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createPoint.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createPoint.rejected, (state, action) => {
        state.error = action.payload as string; // Salvar a mensagem de erro
      });
  },
});

export const { clearError } = pointsSlice.actions;
export default pointsSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  CreateMachineRequest,
  MachineDto,
  UpdateMachineRequest,
} from '@dynamox/shared';
import { machinesApi } from '../../services/api';
import { ApiClientError } from '../../services/apiClient';

interface MachinesState {
  items: MachineDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MachinesState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchMachines = createAsyncThunk(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await machinesApi.list();
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to load machines');
    }
  }
);

export const createMachine = createAsyncThunk(
  'machines/create',
  async (payload: CreateMachineRequest, { rejectWithValue }) => {
    try {
      return await machinesApi.create(payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to create machine');
    }
  }
);

export const updateMachine = createAsyncThunk(
  'machines/update',
  async (
    { id, payload }: { id: string; payload: UpdateMachineRequest },
    { rejectWithValue }
  ) => {
    try {
      return await machinesApi.update(id, payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to update machine');
    }
  }
);

export const deleteMachine = createAsyncThunk(
  'machines/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await machinesApi.remove(id);
      return id;
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to delete machine');
    }
  }
);

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    clearMachinesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load machines';
      })
      .addCase(createMachine.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = [action.payload, ...state.items];
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to create machine';
      })
      .addCase(updateMachine.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to update machine';
      })
      .addCase(deleteMachine.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to delete machine';
      });
  },
});

export const { clearMachinesError } = machinesSlice.actions;
export default machinesSlice.reducer;

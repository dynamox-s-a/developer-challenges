import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMachines, createMachine, updateMachine, deleteMachine } from '../services/machineService';
import { Machine, MachineState,  } from "../types/machines";

export const initialState: MachineState = {
  machines: [],
  loading: false,
  error: null,
};

export const fetchMachines = createAsyncThunk('machines/fetchAll', async () => {
  const response = await getMachines();
  return response.data;
});

export const addMachine = createAsyncThunk('machines/add', async (data: { name: string; type: string }) => {
  const response = await createMachine(data);
  return response.data;
});

export const editMachine = createAsyncThunk('machines/edit', async ({ id, data }: { id: string; data: { name: string; type: string } }) => {
  const response = await updateMachine(id, data);
  return response.data;
});

export const removeMachine = createAsyncThunk('machines/delete', async (id: string) => {
  await deleteMachine(id);
  return id;
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMachines.fulfilled, (state, action: PayloadAction<Machine[]>) => {
        state.machines = action.payload;
        state.loading = false;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.error = action.error.message || 'Error fetching machines';
        state.loading = false;
      })
      .addCase(addMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        state.machines.push(action.payload);
      })
      .addCase(editMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        const index = state.machines.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) state.machines[index] = action.payload;
      })
      .addCase(removeMachine.fulfilled, (state, action: PayloadAction<string>) => {
        state.machines = state.machines.filter((m) => m._id !== action.payload);
      });
  },
});

export default machinesSlice.reducer;

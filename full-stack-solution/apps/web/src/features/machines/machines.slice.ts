import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type {
  CreateMachineInput,
  Machine,
  UpdateMachineInput,
} from "@full-stack-solution/shared";
import { MIN_MONITORING_POINTS_PER_MACHINE } from "@full-stack-solution/shared";
import { serializeApiError, type SerializedApiError } from "@web/api/api-error";
import type { ThunkConfig } from "@web/app/thunk";
import { requireToken } from "@web/app/require-token";
import type { RootState } from "@web/app/store";
import * as machinesApi from "./machines.api";

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

export interface MachinesState {
  items: Machine[];
  status: LoadStatus;
  /** A create/update/delete request is in flight. */
  isMutating: boolean;
  error: SerializedApiError | null;
}

const initialState: MachinesState = {
  items: [],
  status: "idle",
  isMutating: false,
  error: null,
};

export const fetchMachines = createAsyncThunk<Machine[], void, ThunkConfig>(
  "machines/fetch",
  async (_arg, { getState, rejectWithValue }) => {
    try {
      return await machinesApi.listMachines(requireToken(getState()));
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const createMachine = createAsyncThunk<
  Machine,
  CreateMachineInput,
  ThunkConfig
>("machines/create", async (input, { getState, rejectWithValue }) => {
  try {
    return await machinesApi.createMachine(requireToken(getState()), input);
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

export const updateMachine = createAsyncThunk<
  Machine,
  { id: string; changes: UpdateMachineInput },
  ThunkConfig
>("machines/update", async ({ id, changes }, { getState, rejectWithValue }) => {
  try {
    return await machinesApi.updateMachine(
      requireToken(getState()),
      id,
      changes,
    );
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

export const deleteMachine = createAsyncThunk<string, string, ThunkConfig>(
  "machines/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      await machinesApi.deleteMachine(requireToken(getState()), id);
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    machinesErrorDismissed(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? null;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.isMutating = false;
        state.items.push(action.payload);
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.isMutating = false;
        const index = state.items.findIndex(
          (machine) => machine.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.isMutating = false;
        state.items = state.items.filter(
          (machine) => machine.id !== action.payload,
        );
      })
      // Shared handling for every mutation, so a new thunk cannot forget it.
      .addMatcher(
        isAnyOf(
          createMachine.pending,
          updateMachine.pending,
          deleteMachine.pending,
        ),
        (state) => {
          state.isMutating = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          createMachine.rejected,
          updateMachine.rejected,
          deleteMachine.rejected,
        ),
        (state, action) => {
          state.isMutating = false;
          state.error = action.payload ?? null;
        },
      );
  },
});

export const { machinesErrorDismissed } = machinesSlice.actions;
export const machinesReducer = machinesSlice.reducer;

export const selectMachines = (state: RootState): Machine[] =>
  state.machines.items;

/**
 * Machines that do not reach the recommended number of monitoring points.
 *
 * The API deliberately does not enforce the minimum, so the warning lives in
 * the UI (see the README assumptions).
 */
export const selectMachinesBelowMinimumPoints = createSelector(
  [selectMachines],
  (machines) =>
    machines.filter(
      (machine) =>
        machine.monitoringPointsCount < MIN_MONITORING_POINTS_PER_MACHINE,
    ),
);

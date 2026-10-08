import type {
  MachineDto,
  MachineInput,
  PaginationMeta,
} from '@dynapredict/shared-types';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RequestStatus } from '../../app/requestStatus';
import type { RootState } from '../../app/rootReducer';
import { type ApiError, toApiError } from '../../services/apiClient';
import * as machinesApi from '../../services/machinesApi';
import type { MachinesQuery } from '../../services/machinesApi';
import { logout, sessionExpired } from '../auth/authSlice';

export interface MachinesState {
  items: MachineDto[];
  meta: PaginationMeta | null;
  /** The page, size and sort the user asked for; the page refetches on change. */
  query: MachinesQuery;
  status: RequestStatus;
  error: ApiError | null;
  /** Only the latest list request may write its response (see fetchMachines). */
  latestRequestId: string | null;
}

export const DEFAULT_MACHINES_QUERY: MachinesQuery = {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

const initialState: MachinesState = {
  items: [],
  meta: null,
  query: DEFAULT_MACHINES_QUERY,
  status: 'idle',
  error: null,
  latestRequestId: null,
};

type ThunkConfig = { state: RootState; rejectValue: ApiError };

/** Loads the page described by `state.machines.query`. */
export const fetchMachines = createAsyncThunk<
  Awaited<ReturnType<typeof machinesApi.listMachines>>,
  void,
  ThunkConfig
>('machines/fetch', async (_, { getState, rejectWithValue }) => {
  try {
    return await machinesApi.listMachines(getState().machines.query);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

// Mutations refetch the current page instead of patching it locally: the
// server owns the order and the totals, so a new or renamed machine lands
// where the active sort puts it.

export const createMachine = createAsyncThunk<
  MachineDto,
  MachineInput,
  ThunkConfig
>('machines/create', async (input, { dispatch, rejectWithValue }) => {
  try {
    const machine = await machinesApi.createMachine(input);
    void dispatch(fetchMachines());
    return machine;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const updateMachine = createAsyncThunk<
  MachineDto,
  { id: string; input: MachineInput },
  ThunkConfig
>('machines/update', async ({ id, input }, { dispatch, rejectWithValue }) => {
  try {
    const machine = await machinesApi.updateMachine(id, input);
    void dispatch(fetchMachines());
    return machine;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const deleteMachine = createAsyncThunk<string, string, ThunkConfig>(
  'machines/delete',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await machinesApi.deleteMachine(id);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
    // Deleting the only row of the last page would leave an empty page.
    const { items, query } = getState().machines;
    if (items.length === 1 && query.page > 1) {
      dispatch(pageChanged(query.page - 1));
    }
    void dispatch(fetchMachines());
    return id;
  },
);

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    pageChanged(state, action: PayloadAction<number>) {
      state.query.page = action.payload;
    },
    /** A new size or sort starts again from the first page. */
    pageSizeChanged(state, action: PayloadAction<number>) {
      state.query.pageSize = action.payload;
      state.query.page = 1;
    },
    sortChanged(
      state,
      action: PayloadAction<Pick<MachinesQuery, 'sortBy' | 'sortDir'>>,
    ) {
      state.query.sortBy = action.payload.sortBy;
      state.query.sortDir = action.payload.sortDir;
      state.query.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.latestRequestId = action.meta.requestId;
      })
      // A slower, older request (the user clicked again) must not overwrite
      // the newer one's answer.
      .addCase(fetchMachines.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'failed';
        state.error = action.payload ?? toApiError(action.error);
      })
      // Nothing of a closed session survives into the next one.
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const { pageChanged, pageSizeChanged, sortChanged } =
  machinesSlice.actions;
export const machinesReducer = machinesSlice.reducer;

import type {
  CreateMachineRequest,
  Machine,
  MachineSortKey,
  MachineType,
  NextNumber,
  Page,
  SortOrder,
  UpdateMachineRequest,
} from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { deleteJson, getJson, patchJson, postJson } from '../../api/http';
import type { LoadStatus } from '../sectors/sectors-slice';

export interface MachinesQuery {
  page: number;
  pageSize: number;
  sort: MachineSortKey;
  order: SortOrder;
  sectorId: string | null;
}

export interface MachinesState {
  query: MachinesQuery;
  page: Page<Machine> | null;
  status: LoadStatus;
  error: string | null;
}

export const DEFAULT_MACHINES_QUERY: MachinesQuery = {
  page: 1,
  pageSize: 10,
  sort: 'tag',
  order: 'asc',
  sectorId: null,
};

const initialState: MachinesState = {
  query: DEFAULT_MACHINES_QUERY,
  page: null,
  status: 'idle',
  error: null,
};

type Rejects = { rejectValue: RequestFailure };

/** Query string in a fixed parameter order, so the same query is always the same URL. */
export function machinesPath({ page, pageSize, sort, order, sectorId }: MachinesQuery): string {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
    order,
    ...(sectorId ? { sectorId } : {}),
  });
  return `/machines?${params.toString()}`;
}

/** Loads a page; the query is kept so a later change can reload the same page. */
export const fetchMachines = createAsyncThunk<Page<Machine>, MachinesQuery, Rejects>(
  'machines/fetch',
  async (query, { rejectWithValue }) => {
    try {
      return await getJson<Page<Machine>>(machinesPath(query));
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const fetchNextNumber = createAsyncThunk<
  NextNumber,
  { sectorId: string; type: MachineType },
  Rejects
>('machines/nextNumber', async ({ sectorId, type }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams({ sectorId, type });
    return await getJson<NextNumber>(`/machines/next-number?${params.toString()}`);
  } catch (error) {
    return rejectWithValue(toFailure(error));
  }
});

export const createMachine = createAsyncThunk<Machine, CreateMachineRequest, Rejects>(
  'machines/create',
  async (body, { rejectWithValue }) => {
    try {
      return await postJson<Machine>('/machines', body);
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const updateMachine = createAsyncThunk<
  Machine,
  { id: string; changes: UpdateMachineRequest },
  Rejects
>('machines/update', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await patchJson<Machine>(`/machines/${id}`, changes);
  } catch (error) {
    return rejectWithValue(toFailure(error));
  }
});

export const deleteMachine = createAsyncThunk<string, string, Rejects>(
  'machines/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteJson(`/machines/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.query = action.meta.arg;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.page = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the machines.';
      });
  },
});

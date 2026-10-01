import type { CreateSectorRequest, Sector, UpdateSectorRequest } from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { deleteJson, getJson, patchJson, postJson } from '../../api/http';

/** `idle` until the first load: an empty list is only known once the API answered it. */
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'failed';

export interface SectorsState {
  items: Sector[];
  status: LoadStatus;
  error: string | null;
}

const initialState: SectorsState = { items: [], status: 'idle', error: null };

type Rejects = { rejectValue: RequestFailure };

export const fetchSectors = createAsyncThunk<Sector[], void, Rejects>(
  'sectors/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson<Sector[]>('/sectors');
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const createSector = createAsyncThunk<Sector, CreateSectorRequest, Rejects>(
  'sectors/create',
  async (body, { rejectWithValue }) => {
    try {
      return await postJson<Sector>('/sectors', body);
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const updateSector = createAsyncThunk<
  Sector,
  { id: string; changes: UpdateSectorRequest },
  Rejects
>('sectors/update', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await patchJson<Sector>(`/sectors/${id}`, changes);
  } catch (error) {
    return rejectWithValue(toFailure(error));
  }
});

export const deleteSector = createAsyncThunk<string, string, Rejects>(
  'sectors/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteJson(`/sectors/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

/** Same order as the API: by code, then id, so a change never reshuffles the table. */
function sortByCode(sectors: Sector[]): Sector[] {
  return [...sectors].sort((a, b) => a.code.localeCompare(b.code) || a.id.localeCompare(b.id));
}

export const sectorsSlice = createSlice({
  name: 'sectors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.items = action.payload;
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the sectors.';
      })
      .addCase(createSector.fulfilled, (state, action) => {
        state.items = sortByCode([...state.items, action.payload]);
      })
      .addCase(updateSector.fulfilled, (state, action) => {
        state.items = sortByCode(
          state.items.map((sector) => (sector.id === action.payload.id ? action.payload : sector)),
        );
      })
      .addCase(deleteSector.fulfilled, (state, action) => {
        state.items = state.items.filter((sector) => sector.id !== action.payload);
      });
  },
});

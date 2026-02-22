import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Event } from '@/types/event';
import { fetchEvents } from '@/services/eventsService';

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;

  search: string;
  category: string;
  sortBy: 'date' | 'name';
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  search: '',
  category: '',
  sortBy: 'date',
};

export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async () => {
    return fetchEvents();
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export const { setSearch, setCategory, setSortBy } = eventsSlice.actions;
export default eventsSlice.reducer;
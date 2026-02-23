import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Event } from '@/types/event';
import { fetchEvents } from '@/services/eventsService';

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;

  search: string;
  category: 'all' | Event['category'];
  sortBy: 'date' | 'name';
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  search: '',
  category: 'all',
  sortBy: 'date',
};

export const loadEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>('events/loadEvents', async (_, { rejectWithValue }) => {
  try {
    return await fetchEvents();
  } catch {
    return rejectWithValue('Failed to load events');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(
      state,
      action: PayloadAction<'all' | Event['category']>
    ) {
      state.category = action.payload;
    },
    setSortBy(
      state,
      action: PayloadAction<'date' | 'name'>
    ) {
      state.sortBy = action.payload;
    },

    addEvent(state, action: PayloadAction<Event>) {
      state.items.push(action.payload);
    },

    updateEventInState(
      state,
      action: PayloadAction<Event>
    ) {
      state.items = state.items.map((event) =>
        event.id === action.payload.id
          ? action.payload
          : event
      );
    },

    removeEvent(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (event) => event.id !== action.payload
      );
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
        state.error =
          action.payload ?? action.error.message ?? 'Error';
      });
  },
});

export const {
  setSearch,
  setCategory,
  setSortBy,
  addEvent,
  updateEventInState,
  removeEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
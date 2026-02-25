import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Event, EventCreate } from '@/types/event';
import { createEventService, deleteEventService, getEventsService, updateEventService } from '@/services/eventsService';

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const response = await getEventsService();
  return response;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id: string) => {
  await deleteEventService(id);
  return id;
});

export const createEvent = createAsyncThunk('events/createEvent', async (event: EventCreate) => {
  const response = await createEventService(event);
  return response;
});

export const updateEvent = createAsyncThunk('events/updateEvent', async (event: Event) => {
  const response = await updateEventService(event);
  return response;
});

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete event';
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create event';
      });
  },
});

export default eventsSlice.reducer;

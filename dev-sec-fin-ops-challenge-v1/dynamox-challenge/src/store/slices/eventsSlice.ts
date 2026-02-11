import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  EventsState,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
} from "@/types";
import {
  fetchEvents as fetchEventsApi,
  createEvent as createEventApi,
  updateEvent as updateEventApi,
  deleteEvent as deleteEventApi,
} from "@/services/api";

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEventsApi();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch events";
      return rejectWithValue(message);
    }
  },
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event: CreateEventRequest, { rejectWithValue }) => {
    try {
      return await createEventApi(event);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create event";
      return rejectWithValue(message);
    }
  },
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (event: UpdateEventRequest, { rejectWithValue }) => {
    try {
      return await updateEventApi(event);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update event";
      return rejectWithValue(message);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteEventApi(id);
      return id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      return rejectWithValue(message);
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.events = action.payload;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.events = state.events.filter((e) => e.id !== action.payload);
        },
      )
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = eventsSlice.actions;
export default eventsSlice.reducer;

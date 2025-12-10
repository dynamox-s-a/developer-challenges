import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { eventsApi } from "@/lib/api";
import type {
  CreateEventPayload,
  Event,
  EventsState,
  UpdateEventPayload,
} from "@/types";

const initialState: EventsState = {
  events: [],
  isLoading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>("events/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await eventsApi.getAll();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch events",
    );
  }
});

export const createEvent = createAsyncThunk<
  Event,
  CreateEventPayload,
  { rejectValue: string }
>("events/create", async (payload, { rejectWithValue }) => {
  try {
    return await eventsApi.create(payload);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create event",
    );
  }
});

export const updateEvent = createAsyncThunk<
  Event,
  UpdateEventPayload,
  { rejectValue: string }
>("events/update", async (payload, { rejectWithValue }) => {
  try {
    return await eventsApi.update(payload);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update event",
    );
  }
});

export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("events/delete", async (id, { rejectWithValue }) => {
  try {
    await eventsApi.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete event",
    );
  }
});

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
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.isLoading = false;
          state.events = action.payload;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch events";
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create event";
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false;
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update event";
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.events = state.events.filter((e) => e.id !== action.payload);
        },
      )
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete event";
      });
  },
});

export const { clearError } = eventsSlice.actions;
export default eventsSlice.reducer;

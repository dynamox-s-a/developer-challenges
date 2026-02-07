import { createSlice } from "@reduxjs/toolkit";
import { Event } from "@/types";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "./eventsThunk";

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  filters: {
    timeFilter: "all" | "past" | "upcoming";
  };
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  filters: {
    timeFilter: "all",
  },
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTimeFilter: (
      state,
      action: { payload: "all" | "past" | "upcoming" },
    ) => {
      state.filters.timeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao buscar eventos";
      })

      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao criar evento";
      })

      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao atualizar evento";
      })

      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao deletar evento";
      });
  },
});

export const { clearError, setTimeFilter } = eventsSlice.actions;
export default eventsSlice.reducer;

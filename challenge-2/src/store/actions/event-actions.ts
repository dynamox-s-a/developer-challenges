import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Event } from '@/@types/event'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../thunk/event-thunk'

interface EventsState {
  events: Event[]
  isLoading: boolean
  error: string | null
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  error: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // reducers síncronos
    clearEventsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // CREATE EVENT
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // GET EVENT
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload.sort(
          (a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
        )
        state.isLoading = false
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // DELETE EVENT
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.events = state.events.filter((event) => event.id !== action.payload.id)
        state.error = null
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // UPDATE EVENT
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        )
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearEventsError } = eventsSlice.actions
export default eventsSlice.reducer

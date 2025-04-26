import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Event } from '@/@types/event'
import { createEvent } from '../thunk/event-thunk'

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
    // Redutores síncronos (opcionais)
    clearEventsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
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
  },
})

export const { clearEventsError } = eventsSlice.actions
export default eventsSlice.reducer

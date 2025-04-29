import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Event, EventCategory } from '@/@types/event'
import {
  createEvent,
  deleteEvent,
  getEvents,
  getEventsById,
  updateEvent,
} from '../thunk/event-thunk'

interface EventsState {
  events: Event[]
  filteredEvents: Event[]
  filters: {
    searchTerm: string
    timeFilter: 'all' | 'past' | 'upcoming'
    sortBy: 'date' | 'name'
    sortOrder: 'asc' | 'desc'
    category: EventCategory | null
  }
  selectedEvent: Event | null
  isLoading: boolean
  error: string | null
}

const initialState: EventsState = {
  events: [],
  filteredEvents: [],
  filters: {
    searchTerm: '',
    timeFilter: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    category: null,
  },
  selectedEvent: null,
  isLoading: false,
  error: null,
}

const applyAllFilters = (state: EventsState): Event[] => {
  const { events, filters } = state
  const now = new Date()

  return events
    .filter((event) => event.event_name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    .filter((event) => {
      const eventDate = new Date(event.date_time)
      switch (filters.timeFilter) {
        case 'past':
          return eventDate < now
        case 'upcoming':
          return eventDate >= now
        default:
          return true
      }
    })
    .filter(
      (event) =>
        !filters.category || event.category.toLowerCase() === filters.category.toLowerCase()
    )
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.date_time).getTime()
        const dateB = new Date(b.date_time).getTime()
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        const nameA = a.event_name.toLowerCase()
        const nameB = b.event_name.toLowerCase()
        return filters.sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }
    })
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventsError(state) {
      state.error = null
    },
    setSelectedEvent(state, action: PayloadAction<Event | null>) {
      state.selectedEvent = action.payload
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.filters.searchTerm = action.payload
      state.filteredEvents = applyAllFilters(state)
    },
    setTimeFilter(state, action: PayloadAction<'all' | 'past' | 'upcoming'>) {
      state.filters.timeFilter = action.payload
      state.filteredEvents = applyAllFilters(state)
    },
    setSort(state, action: PayloadAction<{ by: 'date' | 'name'; order: 'asc' | 'desc' }>) {
      state.filters.sortBy = action.payload.by
      state.filters.sortOrder = action.payload.order
      state.filteredEvents = applyAllFilters(state)
    },
    toggleCategory(state, action: PayloadAction<EventCategory>) {
      // Se a categoria já está selecionada, deseleciona (seta null)
      // Senão, seleciona a nova categoria
      state.filters.category = state.filters.category === action.payload ? null : action.payload
      state.filteredEvents = applyAllFilters(state)
    },
    resetFilters(state) {
      state.filters = initialState.filters
      state.filteredEvents = applyAllFilters(state)
    },
    clearCategories(state) {
      state.filters.category = null
      state.filteredEvents = applyAllFilters(state)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE EVENT
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        state.events.push(action.payload)
        state.filteredEvents = applyAllFilters(state)
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
        state.events = action.payload
        state.filteredEvents = applyAllFilters(state)
        state.isLoading = false
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // GET EVENTS BY ID
      .addCase(getEventsById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getEventsById.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        console.log(action.payload)
        state.selectedEvent = action.payload
      })
      .addCase(getEventsById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // DELETE EVENT
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.events = state.events.filter((event) => event.id !== action.payload.id)
        state.filteredEvents = applyAllFilters(state)
        state.isLoading = false
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
        state.filteredEvents = applyAllFilters(state)
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSearchTerm,
  setTimeFilter,
  setSort,
  toggleCategory,
  resetFilters,
  setSelectedEvent,
  clearError,
  clearCategories,
} = eventsSlice.actions

export default eventsSlice.reducer

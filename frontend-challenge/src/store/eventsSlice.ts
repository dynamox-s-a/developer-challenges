import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { Event } from '@/types/Event'

export const fetchEvents = createAsyncThunk('events/fetch', async () => {
    const res = await api.get<Event[]>('/events')
    return res.data
})

export const createEvent = createAsyncThunk(
    'events/create',
    async (event: Omit<Event, 'id'>) => {
        const res = await api.post('/events', event)
        return res.data
    }
)

export const updateEvent = createAsyncThunk(
    'events/update',
    async (event: Event) => {
        const res = await api.put(`/events/${event.id}`, event)
        return res.data
    }
)

export const deleteEvent = createAsyncThunk(
    'events/delete',
    async (id: number) => {
        await api.delete(`/events/${id}`)
        return id
    }
)

const eventsSlice = createSlice({
    name: 'events',
    initialState: { list: [] as Event[] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.list = action.payload
        })
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.list.push(action.payload)
        })
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            const index = state.list.findIndex(e => e.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        })
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            state.list = state.list.filter(e => e.id !== action.payload)
        })
    }
})

export default eventsSlice.reducer

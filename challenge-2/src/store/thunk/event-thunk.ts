import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { Event } from '@/@types/event'
import { clientAxios } from '@/lib/axios'

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, 'id'>, { rejectWithValue }) => {
    try {
      const response = await clientAxios.post('/events', eventData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message)
      }
      return rejectWithValue('Erro desconhecido ao criar evento')
    }
  }
)

export const getEvents = createAsyncThunk('events/getEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await clientAxios.get('/events')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
})

export const getEventsById = createAsyncThunk(
  'events/getEventsById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await clientAxios.get(`/events/${eventId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message)
      }
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      await clientAxios.delete(`/events/${eventId}`)
      return { id: eventId }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message)
      }
      return rejectWithValue('Erro desconhecido ao deletar evento')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (event: Event, { rejectWithValue }) => {
    try {
      const response = await clientAxios.patch(`/events/${event.id}`, event)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message)
      }
      return rejectWithValue('Erro desconhecido ao atualizar o evento')
    }
  }
)

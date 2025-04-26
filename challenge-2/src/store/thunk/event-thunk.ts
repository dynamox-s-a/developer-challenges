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

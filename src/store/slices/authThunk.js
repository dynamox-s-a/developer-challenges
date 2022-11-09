import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from 'src/services/api'

export const login = createAsyncThunk('auth/login', async payload => {
  const response = await api.post('/login', payload)
  localStorage.setItem('token', response.data.accessToken)
  return response.data
})

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('token')
})

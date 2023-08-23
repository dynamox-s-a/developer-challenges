import { createSlice } from '@reduxjs/toolkit'

export type User = {
  email?: string
  name?: string
} | null

const initialState: User = {}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = loginSlice.actions

export default loginSlice.reducer

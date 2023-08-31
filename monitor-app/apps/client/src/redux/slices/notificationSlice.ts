import { createSlice } from '@reduxjs/toolkit'

type Notification = {
  variant: string
  message: string
}

const initialState: Notification = { variant: '', message: '' }

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload
    }
  }
})

export const { notify } = notificationSlice.actions

export default notificationSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { login, signOut } from './authThunk'

const initialState = {
  token: null,
  loading: false,
  error: null,
  userData: {},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [signOut.fulfilled]: state => {
      state.userData = {}
      state.token = null
    },
    [login.pending]: state => {
      state.error = null
      state.loading = true
    },
    [login.fulfilled]: (state, action) => {
      const { accessToken, user } = action.payload
      state.token = accessToken
      state.userData = user
      state.loading = false
    },
    [login.rejected]: state => {
      state.loading = false
      state.error = true
    },
  },
})

export const authReducer = authSlice.reducer

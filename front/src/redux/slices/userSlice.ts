import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserReduxState } from '../interface'

const initialState: UserReduxState = {
  id: undefined,
  email: undefined
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserReduxState>) => {
      state.id = action.payload.id
      state.email = action.payload.email
    },
    clearUser: (state) => {
      state.id = undefined
      state.email = undefined
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer

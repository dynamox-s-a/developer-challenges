import { configureStore } from '@reduxjs/toolkit'
import { machinesSlice } from './slices/machinesSlice'
import { loginSlice } from './slices/loginSlice'
import { notificationSlice } from './slices/notificationSlice'
import { spotsSlice } from './slices/spotsSlice'

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    machines: machinesSlice.reducer,
    spots: spotsSlice.reducer,
    notification: notificationSlice.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store

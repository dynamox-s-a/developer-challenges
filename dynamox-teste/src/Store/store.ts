import { configureStore } from '@reduxjs/toolkit'

import DataCharts from './DataChats'

export const store = configureStore({
  reducer: {
    dataCharts: DataCharts
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
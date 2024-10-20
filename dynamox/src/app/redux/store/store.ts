import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slice";
import paginationReducer from "./paginationSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pagination: paginationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

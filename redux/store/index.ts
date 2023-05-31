import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import navStateReducer from "../reducers/navStateReducer";
import sessionReducer from "redux/reducers/sessionReducer";

const reducer = combineReducers({ navStateReducer, sessionReducer });
const store = configureStore({ reducer });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

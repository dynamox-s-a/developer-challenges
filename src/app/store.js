import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    users: usersReducer,
  },
});

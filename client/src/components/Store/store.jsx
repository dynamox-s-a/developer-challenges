import { configureStore } from "@reduxjs/toolkit";
import productsReducer from '../Features/productsSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer
  },
});

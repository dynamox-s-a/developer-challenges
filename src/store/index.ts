import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './ducks/products'

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

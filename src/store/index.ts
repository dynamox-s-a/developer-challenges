import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './ducks/products'

import authReducer from './ducks/auth'

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

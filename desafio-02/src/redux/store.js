import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import productsSlice from './products/productsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    productsSlice
  }
})

export default store
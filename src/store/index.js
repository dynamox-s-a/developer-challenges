import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'

// eslint-disable-next-line import/no-default-export
export default configureStore({
  reducer: {
    auth: authReducer,
  },
})

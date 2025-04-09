import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../reducers'
import { authMiddleware } from '../../utils/middleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>;

export default store;

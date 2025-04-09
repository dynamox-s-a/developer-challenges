import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../reducers'
import { authMiddleware } from '../../utils/middleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),  // Garante que o redux-thunk e outros middlewares estejam sendo utilizados
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from '@reduxjs/toolkit'
import chartsReducer from './slices/chartsSlice'
import createSagaMiddleware from 'redux-saga'

import { watchFetchGraphData } from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    charts: chartsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(watchFetchGraphData)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

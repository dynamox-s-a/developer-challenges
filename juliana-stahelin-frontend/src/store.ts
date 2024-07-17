import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import chartsReducer from './slices/chartsSlice'
import { watchFetchChartsData } from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    charts: chartsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(watchFetchChartsData)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

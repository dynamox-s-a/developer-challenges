// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authActions from './actions/auth-actions'
import eventsActions from './actions/event-actions'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'

const store = configureStore({
  reducer: {
    auth: authActions,
    events: eventsActions,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

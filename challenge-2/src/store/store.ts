// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authActions from './actions/auth-actions'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'

const store = configureStore({
  reducer: {
    auth: authActions,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

// Exporte os tipos corretamente
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Exporte o store padrão
export default store

// Exporte os hooks customizados aqui mesmo
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

/* Core */
import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from 'react-redux'

/* Instruments */
import { rootReducer } from './rootReducer'
import { middleware } from './middleware'
import machinesReducer from "../redux/slices/machinesSlice";

import authReducer from "../redux/slices/authSlice";
import userReducer from "../redux/slices/userSlice";

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export const reduxStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware)
  },
})

import type { MachinesType } from '../../app/types/types';
export type RootState = {
  machines: MachinesType[];
  auth: any;
  user: any;
  faviconUrl: string

};

export const useDispatch = () => useReduxDispatch<ReduxDispatch>()
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector

/* Types */
export type ReduxStore = typeof reduxStore
export type ReduxState = ReturnType<typeof reduxStore.getState>
export type ReduxDispatch = typeof reduxStore.dispatch
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>

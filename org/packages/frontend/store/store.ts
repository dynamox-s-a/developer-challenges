import { configureStore } from '@reduxjs/toolkit';

import userSlice from './features/user-slice';
import machinesSlice from './features/machines-slice';
import loadingSlice from './features/loading-slice';
import errorSlice from './features/error-slice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    user: userSlice,
    machine: machinesSlice,
    loading: loadingSlice,
    error: errorSlice,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

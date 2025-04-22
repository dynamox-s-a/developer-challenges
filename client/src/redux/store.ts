import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './machinesSlice';
import monitoringPointsReducer from './monitoringPointsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

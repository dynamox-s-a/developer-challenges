import { combineReducers } from '@reduxjs/toolkit';

import { machinesSlice } from './machines/slice';
import { measurementsSlice } from './measurements/slice';

export const rootReducer = combineReducers({
  [machinesSlice.name]: machinesSlice.reducer,
  [measurementsSlice.name]: measurementsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

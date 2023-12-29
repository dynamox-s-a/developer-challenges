import { configureStore } from '@reduxjs/toolkit';
import accelerationRms from './reducers/accelerationRms';
import temperatureSlice from './reducers/temperature';
import velocityRmsSlice from './reducers/velocityRms';

export const store = configureStore({
  reducer: {
    chartAccelerationRms: accelerationRms.reducer,
    chartTemperature: temperatureSlice.reducer,
    chartVelocityRms: velocityRmsSlice.reducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

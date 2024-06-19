import { configureStore } from '@reduxjs/toolkit';
import sensorReducer from './sensor-slice';

/**
 * Nomeação para os redux
 */
const store = configureStore({
  reducer: {
    sensor: sensorReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
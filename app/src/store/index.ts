import { configureStore } from '@reduxjs/toolkit';
import accelerationRms from './reducers/accelerationRms';
import temperatureSlice from './reducers/temperature';
import velocityRmsSlice from './reducers/velocityRms';
import createSagaMiddleware from 'redux-saga';
import { accelerationRmsSaga } from './sagas/accelerationRms';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    chartAccelerationRms: accelerationRms.reducer,
    chartTemperature: temperatureSlice.reducer,
    chartVelocityRms: velocityRmsSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(sagaMiddleware),
});

sagaMiddleware.run(accelerationRmsSaga);

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

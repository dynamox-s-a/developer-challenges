import { configureStore } from '@reduxjs/toolkit';
import accelerationRms from './reducers/accelerationRms';
import temperatureSlice from './reducers/temperature';
import velocityRmsSlice from './reducers/velocityRms';
import createSagaMiddleware from 'redux-saga';
import { accelerationRmsSaga } from './sagas/accelerationRms';
import { temperatureSaga } from './sagas/temperature';
import { velocityRmsSaga } from './sagas/velocityRms';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    accelerationRms: accelerationRms.reducer,
    temperature: temperatureSlice.reducer,
    velocityRms: velocityRmsSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(sagaMiddleware),
});

sagaMiddleware.run(accelerationRmsSaga);
sagaMiddleware.run(temperatureSaga);
sagaMiddleware.run(velocityRmsSaga);

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

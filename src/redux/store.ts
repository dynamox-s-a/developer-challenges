import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import accelerationReducer from './slices/accelerationSlice';
import temperatureReducer from './slices/temperatureSlice';
import velocityRmsReducer from './slices/velocityRmsSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    acceleration: accelerationReducer,
    temperature: temperatureReducer,
    velocityRms: velocityRmsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

/* // store/index.ts
import { createStore, combineReducers, applyMiddleware, Middleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import machineDataReducer from '../reducers/machineDataReducer';
import sensorDataReducer from '../reducers/sensorDataReducer';

const rootReducer = combineReducers({
  machineData: machineDataReducer,
  sensorData: sensorDataReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware));

export default store; */
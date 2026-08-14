import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;

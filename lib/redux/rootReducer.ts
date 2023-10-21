import { combineReducers } from 'redux';
import pageReducer from './slices/pageSlice';

export const rootReducer = combineReducers({
  page: pageReducer,
});




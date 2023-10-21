import { combineReducers } from 'redux';
import authReducer from './slices/authSlice'; 
import pageReducer from './slices/pageSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  page: pageReducer,
});




import { combineReducers } from 'redux';
import authReducer from './slices/authSlice'; 
import pageReducer from './slices/pageSlice';
import machineTypesReducer from './slices/machineTypesSlice';
import machinesReducer from './slices/machinesSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  page: pageReducer,
  machineTypes: machineTypesReducer,
  machines: machinesReducer
});




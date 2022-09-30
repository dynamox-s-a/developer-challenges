import { combineReducers } from 'redux';
import productReducer from './product';

const rootReducer = combineReducers({
  productReducer,
});

export default rootReducer;

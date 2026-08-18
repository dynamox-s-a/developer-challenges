import { combineReducers } from 'redux';

import { dataReducer } from './data/reducer';

export const rootReducer = combineReducers({
  data: dataReducer,
});

import {combineReducers} from 'redux';
import userReducer from './reducers/userReducer';

export default combineReducers ({
    user: userReducer
});
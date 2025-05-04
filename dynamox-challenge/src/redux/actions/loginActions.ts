
import { Dispatch } from 'redux';
import { Action } from '../../types';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

// URL da API
const API_UTL = 'http://localhost:3001';

// Usuário
export const loginUser = (email: string, password: string): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch) => {
    console.log('Dispatching LOGIN_REQUEST');
    dispatch({ type: 'LOGIN_REQUEST', payload: { email, password } });
    
    try {
      const response = await fetch(`${API_UTL}/users?email=${email}&password=${password}`);
      const data = await response.json();
      const dataRemovePassword: Array<Object>  = data.map((user: { password: string; }) => {
        const { password, ...rest } = user;
        return rest;
      });
      dispatch({ type: 'GET_USER', payload: dataRemovePassword[0] });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
};
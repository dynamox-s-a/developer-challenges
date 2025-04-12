// Definição das actions
import { Dispatch } from 'redux';
import { Machine } from '../../types';
import { Action } from '../reducers';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

const API_UTL = 'http://localhost:3001';

// Usuário
export const loginUser = (email: string, password: string): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch) => {
    console.log('Dispatching LOGIN_REQUEST');
    dispatch({ type: 'LOGIN_REQUEST', payload: { email, password } });
    
    try {
      const response = await fetch(`${API_UTL}/users?email=${email}&password=${password}`);
      const data = await response.json();
      console.log('Dispatching GET_USER with data:', data[0]);
      dispatch({ type: 'GET_USER', payload: data[0] });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
};

// Máquinas
export const fetchMachines = (
  userId: number | null
): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    if (userId === null) return;

    try {
      const response = await fetch(`${API_UTL}/machines?userId=${userId}`);
      const machines: Machine[] = await response.json();
      dispatch({ type: 'GET_MACHINES', payload: machines });
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };
};

export const postMachine = (machine: Machine): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const response = await fetch(`${API_UTL}/machines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: "teste1", ...machine}),
      });

      if (!response.ok) {
        throw new Error('Failed to add machine');
      }

      const data = await response.json();
      dispatch({ type: 'POST_MACHINE', payload: data });
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };
}


// Sensores
export const fetchSensor = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch(`${API_UTL}/sensors/${id}`);
      const data = await response.json();
      dispatch({ type: 'GET_SENSOR', payload: data });
    } catch (error) {
      console.error('Error fetching sensor:', error);
    }
  };
}

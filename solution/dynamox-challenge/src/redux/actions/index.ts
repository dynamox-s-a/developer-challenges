// Definição das actions
import { Dispatch } from 'redux';

const API_UTL = 'http://localhost:3001';

// Usuário
export const getUser = (email: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch(`${API_UTL}/users/${email}`);
      const data = await response.json();
      dispatch({ type: 'GET_USER', payload: data });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
}

// Máquinas
export const fetchMachines = (id: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch(`${API_UTL}/machines/${id}`);
      const data = await response.json();
      dispatch({ type: 'GET_MACHINES', payload: data });
    } catch (error) {
      console.error('Error fetching machines:', error);
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
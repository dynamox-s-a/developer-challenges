// Definição das actions
import { Dispatch } from 'redux';
import { Machine } from '../../types';

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
export const fetchMachines = (access: Machine[]) => {
  return async (dispatch: Dispatch) => {
    try {
      const machinesPromises = access.map(async (machineId) => {
        const response = await fetch(`${API_UTL}/machines/${machineId}`);
        const data = await response.json();
        return data; 
      });

      const machines = await Promise.all(machinesPromises);
      dispatch({ type: 'GET_MACHINES', payload: machines });
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };
};


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
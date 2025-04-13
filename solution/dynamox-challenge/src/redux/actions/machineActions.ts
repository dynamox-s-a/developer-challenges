// Actions das máquinas
import { Dispatch } from 'redux';
import { Machine, Action } from '../../types';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { v1 as uuidv1 } from 'uuid';

// URL da API
const API_UTL = 'http://localhost:3001';

export const getMachines = (
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
      const newId = uuidv1();
      const response = await fetch(`${API_UTL}/machines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: newId, ...machine}),
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

export const deleteMachine = (machineId: string): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const response = await fetch(`${API_UTL}/machines/${machineId}`, {
        method: 'DELETE',
      });

      const machineDelete = await response.json();

      if (!response.ok) {
        throw new Error('Failed to delete machine');
      }

      dispatch({ type: 'DELETE_MACHINE', payload: machineDelete });
    } catch (error) {
      console.error('Error deleting machine:', error);
    }
  }
}

export const updateMachine = (machine: Machine): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const response = await fetch(`${API_UTL}/machines/${machine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });

      if (!response.ok) {
        throw new Error('Failed to update machine');
      }
      const data = await response.json();
      console.log(data);
      dispatch({ type: 'UPDATE_MACHINE', payload: data });
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  }
}

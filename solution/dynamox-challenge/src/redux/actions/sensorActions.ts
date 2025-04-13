// Actions dos sensores
import { Dispatch } from 'redux';

// URL da API
const API_UTL = 'http://localhost:3001';


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
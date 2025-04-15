// Actions para o monitoramento de máquinas
import { Dispatch } from 'redux';
import { Action, MonitoringPoint, Sensor } from '../../types';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { v1 as uuidv1 } from 'uuid';

// URL da API
const API_UTL = 'http://localhost:3001';

export const postMonitoringPoint = (
  machineId: string,
  monitoringPoint: MonitoringPoint
): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const newId = uuidv1();
      const response = await fetch(`${API_UTL}/monitoringPoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: newId, machineId: machineId, ...monitoringPoint}),
      });

      if (!response.ok) {
        throw new Error('Failed to add monitoring point');
      }

      const data = await response.json();
      dispatch({ type: 'POST_MONITORING_POINT', payload: data });
    } catch (error) {
      console.error('Error adding monitoring point:', error);
    }
  };
};

export const getMonitoringPoints = (userId : number | null): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    if (userId === null) return;

    try {
      const response = await fetch(`${API_UTL}/monitoringPoints?userId=${userId}`);
      const monitoringPoints: MonitoringPoint[] = await response.json();
      dispatch({ type: 'GET_MONITORING_POINTS', payload: monitoringPoints });
    } catch (error) {
      console.error('Error fetching monitoring points:', error);
    }
  };
}

export const postSensor = (model: string, monitoringPointId: string): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const newId = uuidv1();
      const response = await fetch(`${API_UTL}/sensors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: newId, model: model, monitoringPointId: monitoringPointId}),
      });

      if (!response.ok) {
        throw new Error('Failed to add sensor');
      }

      const data = await response.json();
      dispatch({ type: 'POST_SENSOR', payload: data });
    } catch (error) {
      console.error('Error adding sensor:', error);
    }
  };
};

export const getSensors = (): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const response = await fetch(`${API_UTL}/sensors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add sensor');
      }

      const data: Sensor[] = await response.json();
      dispatch({ type: 'GET_SENSORS', payload: data });
      return data;
    } catch (error) {
      console.error('Error adding sensor:', error);
    }
  }
}
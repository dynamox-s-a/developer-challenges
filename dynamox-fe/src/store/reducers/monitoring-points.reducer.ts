import { MonitoringPoints } from '@/components/dashboard/list-monitoring-points/monitoring-points-table';
import monitoringPointsService from '@/services/be/monitoring-points';
import { Dispatch } from 'redux';

interface MonitoringPointsState {
  monitoringPoints: MonitoringPoints[];
}

const initialState: MonitoringPointsState = {
  monitoringPoints: [],
};

interface ExampleAction {
  type: string;
  payload: MonitoringPoints[];
}

const MonitoringPointReducer = (state = initialState, action: ExampleAction): MonitoringPointsState => {
  switch (action.type) {
    case 'GET/MONITORING_POINTS_SUCCESS':
      return { ...state, monitoringPoints: action.payload };
    case 'GET/MONITORING_POINTS_FAILURE':
      return { ...state, monitoringPoints: [] };
    default:
      return state;
  }
};


export const getAll = () => {
  return async (dispatch: Dispatch<ExampleAction>) => {
    dispatch({ type: 'GET/MONITORING_POINTS_START', payload: [] });
    try {
      const response = await monitoringPointsService.getAll();

      dispatch({ type: 'GET/MONITORING_POINTS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'GET/MONITORING_POINTS_FAILURE', payload: [] });
    }
  };
};


export default MonitoringPointReducer;
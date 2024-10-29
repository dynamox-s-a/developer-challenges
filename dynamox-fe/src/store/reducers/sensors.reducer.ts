import sensorsService from '@/services/be/sensors';
import { Dispatch } from 'redux';

export interface Sensors {
    uuid: string;
    modelName: string;
}

interface SensorsState {
    sensors: Sensors[];
}

const initialState: SensorsState = {
    sensors: [],
};

interface ExampleAction {
    type: string;
    payload: Sensors[];
}

const SensorsReducer = (state = initialState, action: ExampleAction): SensorsState => {
    switch (action.type) {
        case 'GET/SENSORS_SUCCESS':
            return { ...state, sensors: action.payload };
        case 'GET/SENSORS_FAILURE':
            return { ...state, sensors: [] };
        default:
            return state;
    }
};


export const getAll = () => {
    return async (dispatch: Dispatch<ExampleAction>) => {
        dispatch({ type: 'GET/SENSORS_START', payload: [] });
        try {
            const response = await sensorsService.getAll();

            dispatch({ type: 'GET/SENSORS_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'GET/SENSORS_FAILURE', payload: [] });
        }
    };
};


export default SensorsReducer;
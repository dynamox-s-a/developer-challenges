import machinesService from '@/services/be/machines';
import { Dispatch } from 'redux';

export interface Machines {
    uuid: string;
    name: string;
    type: string;
}

interface MachinesState {
    machines: Machines[];
}

const initialState: MachinesState = {
    machines: [],
};

interface ExampleAction {
    type: string;
    payload: Machines[];
}

const MachinesReducer = (state = initialState, action: ExampleAction): MachinesState => {
    switch (action.type) {
        case 'GET/MACHINES_SUCCESS':
            return { ...state, machines: action.payload };
        case 'GET/MACHINES_FAILURE':
            return { ...state, machines: [] };
        default:
            return state;
    }
};


export const getAll = () => {
    return async (dispatch: Dispatch<ExampleAction>) => {
        dispatch({ type: 'GET/MACHINES_START', payload: [] });
        try {
            const response = await machinesService.getAll();

            dispatch({ type: 'GET/MACHINES_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'GET/MACHINES_FAILURE', payload: [] });
        }
    };
};


export default MachinesReducer;
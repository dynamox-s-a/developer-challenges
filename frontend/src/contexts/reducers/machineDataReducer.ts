/* // reducers/machineDataReducer.ts
import { STORE_MACHINE_DATA, UPDATE_MACHINE_DATA, DELETE_MACHINE_DATA } from '../../models/machineAndSensorTypes';

const initialState = [];

export default function machineDataReducer(state = initialState, action) {
  switch (action.type) {
    case STORE_MACHINE_DATA:
      return [...state, action.payload];
    case UPDATE_MACHINE_DATA:
      return state.map((item) => (item.id === action.payload.id ? action.payload : item));
    case DELETE_MACHINE_DATA:
      return [];
    default:
      return state;
  }
} */
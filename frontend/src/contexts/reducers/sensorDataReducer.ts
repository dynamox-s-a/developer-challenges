/* // reducers/sensorDataReducer.ts
import { STORE_SENSOR_DATA, UPDATE_SENSOR_DATA, DELETE_SENSOR_DATA } from '../../models/machineAndSensorTypes';

const initialState = [];

export default function sensorDataReducer(state = initialState, action) {
  switch (action.type) {
    case STORE_SENSOR_DATA:
      return [...state, action.payload];
    case UPDATE_SENSOR_DATA:
      return state.map((item) => (item.id === action.payload.id ? action.payload : item));
    case DELETE_SENSOR_DATA:
      return [];
    default:
      return state;
  }
} */
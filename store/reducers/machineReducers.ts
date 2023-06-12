import { Machine } from "../machineTypes";
import { SET_MACHINES, ADD_MACHINE } from "../actions/machineActions";

const initialState: Machine[] = [];

const machineReducer = (state = initialState, action: any): Machine[] => {
  switch (action.type) {
    case SET_MACHINES:
      return action.payload;
    case ADD_MACHINE:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default machineReducer;

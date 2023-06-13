import { Machine, MonitoringPoint } from "../storeTypes";
import {
  SET_MACHINES,
  ADD_MACHINE,
  ADD_MONITORING_POINT,
  DELETE_MACHINE,
  SET_MONITORING_POINTS,
  EDIT_MACHINE,
} from "../actions/machineActions";

interface GlobalState {
  machines: Machine[];
  monitoringPoints: MonitoringPoint[];
}

const initialState: GlobalState = {
  machines: [],
  monitoringPoints: [],
};

const machineReducer = (state = initialState, action: any): GlobalState => {
  switch (action.type) {
    case SET_MACHINES:
      return {
        ...state,
        machines: action.payload,
      };
    case SET_MONITORING_POINTS:
      return {
        ...state,
        monitoringPoints: action.payload,
      };
    case EDIT_MACHINE:
      const updatedMachine = action.payload;
      const editedMachines = state.machines.map((machine) =>
        machine.id === updatedMachine.id ? updatedMachine : machine
      );
      return {
        ...state,
        machines: editedMachines,
      };
    case ADD_MACHINE:
      return {
        ...state,
        machines: [...state.machines, action.payload],
      };
    case ADD_MONITORING_POINT:
      return {
        ...state,
        monitoringPoints: [...state.monitoringPoints, action.payload],
      };
    case DELETE_MACHINE:
      const deletedMachineId = action.payload;
      const updatedMachines = state.machines.filter(
        (machine) => machine.id !== deletedMachineId
      );
      return {
        ...state,
        machines: updatedMachines,
      };
    default:
      return state;
  }
};

export default machineReducer;

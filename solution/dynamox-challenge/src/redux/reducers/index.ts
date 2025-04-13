import { AuthState, Machine, MonitoringPoint } from "../../types";
import { Action } from "../../types";

export interface RootState extends AuthState {
  role: string;
  machines: Machine[];
  monitoringPoints: MonitoringPoint[]; 
}

const INITIAL_STATE: RootState = {
  id: null,
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  role: '', 
  machines: [], 
  monitoringPoints: [], 
};

export const rootReducer = (state = INITIAL_STATE, action: Action): RootState => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        id: action.payload.id,
        user: action.payload.username,
        role: action.payload.role, 
        isLoggedIn: true,
        isLoading: false,
        error: null,
        machines: action.payload.machines, 
      };
    case "GET_MACHINES": 
      return {
        ...state,
        machines: action.payload, 
    };
    case "POST_MACHINE":
      return {
        ...state,
        machines: [...state.machines, action.payload], 
      };
    case "DELETE_MACHINE":
      return {
        ...state,
        machines: state.machines.filter(machine => machine.id !== action.payload.id),
      }
      case "UPDATE_MACHINE":
        return {
          ...state,
          machines: state.machines.map((m) =>
            m.id === action.payload.id ? action.payload : m
          ),
      };
    case "POST_MONITORING_POINT":
      return {
        ...state,
        monitoringPoints: [...state.monitoringPoints, action.payload]
      }
    case "GET_MONITORING_POINTS":
      return {
        ...state,
        monitoringPoints: action.payload,
      }
    case "LOGIN_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return INITIAL_STATE; 
    default:
      return state;
  }
};


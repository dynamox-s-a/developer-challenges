import { AuthState, Machine, Sensor } from "../../types";

export interface RootState extends AuthState {
  role: string;
  machines: Machine[];
  sensors: Sensor[]; 
}

const INITIAL_STATE: RootState = {
  id: null,
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  role: '', 
  machines: [], 
  sensors: [], 
};

export type Action =
  | { type: "GET_USER"; payload: { id: number, username: string; role: string, machines: Machine[], sensors: Sensor[] } }
  | { type: "GET_MACHINES"; payload: Machine[] }
  | {type: "POST_MACHINE"; payload: Machine}
  | { type: "DELETE_MACHINE"; payload: Machine }
  | { type: "UPDATE_MACHINE"; payload: Machine }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGIN_REQUEST"; payload: { email: string; password: string } }
  | { type: "LOGOUT" }

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


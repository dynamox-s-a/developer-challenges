import { AuthState, Machine, Sensor } from "../../types";

export interface RootState extends AuthState {
  role: string;
  machines: Machine[];
  sensors: Sensor[]; 
}

const INITIAL_STATE: RootState = {
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  role: '', 
  machines: [], 
  sensors: [], 
};

type Action =
  | { type: "GET_USER"; payload: { username: string; role: string, machines: Machine[], sensors: Sensor[] } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGIN_REQUEST"; payload: { username: string; password: string } }
  | { type: "LOGOUT" };

export const rootReducer = (state = INITIAL_STATE, action: Action): RootState => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        user: action.payload.username,
        role: action.payload.role, 
        isLoggedIn: true,
        isLoading: false,
        error: null,
        machines: action.payload.machines, 
        sensors: action.payload.sensors, 
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


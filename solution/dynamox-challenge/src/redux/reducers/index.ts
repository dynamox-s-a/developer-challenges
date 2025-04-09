// src/redux/reducers.ts
import { AuthState, Machine, Sensor } from "../../types";

export interface RootState extends AuthState {
  machine: Machine | null;
  sensor: Sensor | null;
}

const INITIAL_STATE: RootState = {
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  machine: null,
  sensor: null,
};

type Action =
  | { type: "GET_USER"; payload: string }
  | { type: "GET_MACHINE"; payload: Machine }
  | { type: "GET_SENSOR"; payload: Sensor }
  | { type: "LOGIN_REQUEST"; payload: { username: string; password: string } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }; // Aqui está a action genérica de logout

export const rootReducer = (state = INITIAL_STATE, action: Action): RootState => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      };
    case "GET_MACHINE":
      return {
        ...state,
        machine: action.payload,
        isLoading: false,
        error: null,
      };
    case "GET_SENSOR":
      return {
        ...state,
        sensor: action.payload,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      return INITIAL_STATE; 
    default:
      return state;
  }
};

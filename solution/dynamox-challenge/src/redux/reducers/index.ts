import { AuthState, Machine, Sensor } from "../../types"

interface RootState extends AuthState {
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
}

type Action =
  | { type: "GET_USER"; payload: string }
  | { type: "GET_MACHINE"; payload: Machine }
  | { type: "GET_SENSOR"; payload: Sensor };


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
      default:
        return state;
    }
  };
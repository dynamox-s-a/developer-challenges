import { UserActionTypes, SET_USER_INFO } from '../../models/userTypes';

const initialState = {
  user: null,
};

export const userReducer = (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
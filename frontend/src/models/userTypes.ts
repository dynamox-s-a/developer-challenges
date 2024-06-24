import { User } from './userModel';

export const SET_USER_INFO = 'SET_USER_INFO';

export interface SetUserInfoAction {
  type: typeof SET_USER_INFO;
  payload: User;
}

export type UserActionTypes = SetUserInfoAction;
import { User } from '../../models/userModel'; 
import { SET_USER_INFO, SetUserInfoAction } from '../../models/userTypes';

export const setUserInfo = (user: User): SetUserInfoAction => ({
  type: SET_USER_INFO,
  payload: user,
});
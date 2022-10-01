import { USER_LOGIN,  } from '../actions';

const initialState = {
  user: {
    emailDefault: 'teste@teste.com',
    senhaDefault: 'senhateste',
  }
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case USER_LOGIN:
    return {
      ...state,
      user: {
        emailDefault: action.value.email,
        senhaDefault: action.value.senha,
      }
    };
  default:
    return state;
  }
};

export default userReducer;

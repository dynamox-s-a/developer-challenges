import { createAction, createReducer } from '@reduxjs/toolkit'

const INITIAL_STATE = {
  isAuth: !!sessionStorage.getItem('@dynamox-challenge-02-token'),
}

export const loginAction = createAction('LOGIN')
export const logoutAction = createAction('LOGOUT')

export default createReducer(INITIAL_STATE, {
  [loginAction.type]: (state, action) => ({ ...state, isAuth: true }),
  [logoutAction.type]: (state, action) => ({ ...state, isAuth: false }),
})

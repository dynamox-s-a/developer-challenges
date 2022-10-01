export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
export const REGISTER_NEW_PRODUCT = 'REGISTER_NEW_PRODUCT';
export const USER_LOGIN = 'USER_LOGIN';


export const actionGetProducts = (value) => ({ type: GET_ALL_PRODUCTS, value });

export const actionRegisterProduct = (value) => ({ type: REGISTER_NEW_PRODUCT, value });

export const actionLoginUser = (value) => ({ type: USER_LOGIN, value });

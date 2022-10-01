export const GETALLPRODUCTS = 'GETALLPRODUCTS';
export const REGISTER_NEW_PRODUCT = 'REGISTER_NEW_PRODUCT';

export const actionGetProducts = (value) => ({ type: GETALLPRODUCTS, value });

export const actionRegisterProduct = (value) => ({ type: REGISTER_NEW_PRODUCT, value });

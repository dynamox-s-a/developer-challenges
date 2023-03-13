import {createAction, createReducer} from "@reduxjs/toolkit";
const INITIAL_STATE = [];
export const addProduct = createAction("ADD_PRODUCT");
export const getProducts = createAction("ADD_PRODUCTS");
export const removeProduct = createAction("REMOVE_ITEM");
export const updateProduct = createAction("UPDATE_PRODUCT");
export const showNewModal = createAction("SHOW_NEW_MODAL");
export const showUpdateModal = createAction("SHOW_UPDATE_MODAL");

export default createReducer(INITIAL_STATE, {
  [addProduct.type]: (state, action) => [...state, action.payload],
  [getProducts.type]: (state, action) => [...action.payload],
  [removeProduct.type]: (state, action) =>
    state.filter((product) => product.id !== action.payload),
  [updateProduct.type]: (state, action) =>
    state.map((product) => {
      if (product.id === action.payload.id) {
        return action.payload;
      }
      return product;
    }),
});

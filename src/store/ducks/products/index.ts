import { createAction, createReducer } from '@reduxjs/toolkit'

interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

const INITIAL_STATE: Product[] = []

export const createProductAction = createAction<Product>('ADD_PRODUCT')
export const getAllProductsAction = createAction<Product[]>('ADD_PRODUCTS')
export const updateProductAction = createAction<Product>('EDIT_PRODUCT')
export const deleteProductAction = createAction<string>('REMOVE_PRODUCT')

export default createReducer(INITIAL_STATE, {
  [createProductAction.type]: (state, action) => [...state, action.payload],
  [getAllProductsAction.type]: (state, action) => [...action.payload],
  [updateProductAction.type]: (state, action) => [...state, action.payload],
  [deleteProductAction.type]: (state, action) =>
    state.filter((item) => item.id !== action.payload),
})

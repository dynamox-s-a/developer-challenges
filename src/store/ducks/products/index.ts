import { createAction, createReducer } from '@reduxjs/toolkit'

interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate?: string
  price: number
}

interface StateProps {
  products: Product[]
  selectedProduct: Product | undefined
}

const INITIAL_STATE: StateProps = {
  products: [],
  selectedProduct: undefined,
}

export const createProductAction = createAction<Product>('ADD_PRODUCT')
export const getAllProductsAction = createAction<Product[]>('ADD_PRODUCTS')
export const updateProductAction = createAction<Product>('EDIT_PRODUCT')
export const deleteProductAction = createAction<string>('REMOVE_PRODUCT')
export const getProductAction = createAction<string>('GET_PRODUCT')

export default createReducer(INITIAL_STATE, {
  [createProductAction.type]: (state, action) => ({
    ...state,
    products: [...state.products, action.payload],
  }),
  [getAllProductsAction.type]: (state, action) => ({
    ...state,
    products: [...action.payload],
  }),
  [updateProductAction.type]: (state, action) => ({
    ...state,
    products: [...state.products, action.payload],
  }),
  [deleteProductAction.type]: (state, action) => ({
    ...state,
    products: state.products.filter((item) => item.id !== action.payload),
  }),
  [getProductAction.type]: (state, action) => ({
    ...state,
    selectedProduct: state.products.find((item) => item.id === action.payload),
  }),
})

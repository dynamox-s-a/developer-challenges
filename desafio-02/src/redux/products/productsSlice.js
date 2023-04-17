import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, editProduct, deleteProduct, getProductById } from './productsActions';

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  productSelected: {}
};

const productsSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchProducts.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    },
    [fetchProducts.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
    [createProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products.push(action.payload);
    },
    [createProduct.fulfilled]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
    [editProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [editProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products.push(action.payload);
    },
    [editProduct.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
    [deleteProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products =  state.products.filter((product) => product.id !== action.payload);
    },
    [deleteProduct.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
    [getProductById.pending]: (state) => {
      state.isLoading = true;
    },
    [getProductById.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.productSelected =  state.products.find((product) => product.id === action.payload);
    },
    [getProductById.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
  }
});

export default productsSlice.reducer;
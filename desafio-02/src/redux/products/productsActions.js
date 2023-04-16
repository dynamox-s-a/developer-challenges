import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllProducts, addNewProduct, updateProduct, removeProduct } from '../../services/requests';

export const fetchProducts = createAsyncThunk(
  'products/productsList',
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchAllProducts();
      if (products === null) {
        return rejectWithValue("Não foi possível obter a lista de produtos");
      }
      console.log(products)

      return products;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      const newProduct = await addNewProduct(product);

      if (newProduct === null) {
        return rejectWithValue("Não foi possível cadastrar este novo produto");
      }

      return newProduct;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async (product, { rejectWithValue }) => {
    try {
      const productUpdated = await updateProduct(product.id, product);
      
      if (productUpdated === null) {
        return rejectWithValue("Não foi possível atualizar os dados deste produto");
      }

      return productUpdated;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const productRemoved = await removeProduct(id);

      if (productRemoved === null) {
        return rejectWithValue("Não foi possível excluir o produto pretendido");
      }

      return productRemoved;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
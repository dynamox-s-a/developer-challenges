import { createSlice } from "@reduxjs/toolkit";
import { useCreateAppAsyncThunk } from "../hooks/useCreateAppAsyncThunk";
import { IProductsState } from "../interfaces/IProducts";
import { fetchProducts } from "../helpers/fetchAPI";

export const fetchAllProducts = useCreateAppAsyncThunk(
  "products/fetchProducts",
  async (_param, thunkAPI) => {
    const products = await fetchProducts();

    if (products === null) {
      return thunkAPI.rejectWithValue("Error fetching products");
    }

    return products;
  }
);

const INITIAL_STATE: IProductsState = {
  products: [],
  loading: false,
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllProducts.rejected, (state) => {
      state.loading = false;
    });
  },
});

// export const { } = productsSlice.actions;

export default productsSlice.reducer;

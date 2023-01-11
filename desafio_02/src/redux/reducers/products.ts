import { createSlice } from "@reduxjs/toolkit";
import { useCreateAppAsyncThunk } from "../hooks/useCreateAppAsyncThunk";
import { IProduct, IProductsState } from "../interfaces/IProducts";
import { fetchProducts, fetchAddNewProduct } from "../helpers/fetchAPI";

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

export const addNewProduct = useCreateAppAsyncThunk(
  "products/addNewProduct",
  async (newProduct: IProduct, thunkAPI) => {
    const product = await fetchAddNewProduct(newProduct);

    if (product === null) {
      return thunkAPI.rejectWithValue("Error adding new product");
    }

    return product;
  }
);

const INITIAL_STATE: IProductsState = {
  products: [],
  newProduct: {
    name: "",
    price: "",
    perishable: "",
    expirationDate: "",
    manufactureDate: "",
    quantity: "",
  } as unknown as IProduct,
  loading: false,
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState: INITIAL_STATE,
  reducers: {
    setNewProductInfo: (state, action) => {
      switch (action.payload.name) {
        case "productName":
          state.newProduct.name = action.payload.value;
          break;
        case "price":
          state.newProduct.price = action.payload.value;
          break;
        case "perishable":
          state.newProduct.perishable = action.payload.value;
          break;
        case "expirationDate":
          state.newProduct.expirationDate = action.payload.value;
          break;
        case "manufactureDate":
          state.newProduct.manufactureDate = action.payload.value;
          break;
        case "quantity":
          state.newProduct.quantity = action.payload.value;
          break;
        default:
          break;
      }
    },
    resetNewProductInfo: (state) => {
      state.newProduct = {
        name: "",
        price: "",
        perishable: "",
        expirationDate: "",
        manufactureDate: "",
        quantity: "",
      } as unknown as IProduct;
    },
  },
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
    builder.addCase(addNewProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addNewProduct.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setNewProductInfo, resetNewProductInfo } = productsSlice.actions;

export default productsSlice.reducer;

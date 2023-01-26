import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
});

export default productsSlice.reducer;

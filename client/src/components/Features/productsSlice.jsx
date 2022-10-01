import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: [],
}

const productsSlice = createSlice({
  name: "repositories", initialState,
  reducers: {
    addProducts: (
      state,
      action
    ) => {
      state.value = action.payload;
    },
  },
});

export const { addProducts } = productsSlice.actions
export default productsSlice.reducer
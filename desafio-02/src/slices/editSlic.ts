import DataCreate from "@/interfaces/dataCreate";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const  fecthProducts = createAsyncThunk('/products', async (thunkApi) => {
    const response = await fetch('url');
    const data = await response.json()
    return data;
})


const initialState={
    data:{}

} as any

const productsSlice = createSlice({
    name: 'products', 
    initialState,
    reducers: {
        editProduct: (state, action: PayloadAction<DataCreate>) => {
            state.value = action.payload
        }
    }
})
export  const { editProduct } = productsSlice.actions;
export const productReducer = productsSlice.reducer;
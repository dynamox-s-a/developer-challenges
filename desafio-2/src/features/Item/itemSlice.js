import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "../../utils/localStorage";

const initialState = {
  isLoading: false,
  produto: "",
  fabDate: "",
  perishableOptions: ["true", "false"],
  perishable: "false",
  validade: "",
  price: "",
  isEditing: false,
  editItemId: "",
};
export const createItem = async (item) => {
  try {
    await axios.post("http://localhost:3002/Products", {
      produto: item.produto,
      fabDate: Number(item.fabDate),
      perishable: item.perishable,
      validade: item.validade,
      price: item.price,
    });
  } catch (error) {
    return alert("Erro ao criar o anúncio!");
  }
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return initialState;
    },
    setEditItem: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: {
    [createItem.pending]: (state) => {
      state.isLoading = true;
    },
    [createItem.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success("Item criado");
    },
    [createItem.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues, setEditItem } = itemSlice.actions;

export default itemSlice.reducer;

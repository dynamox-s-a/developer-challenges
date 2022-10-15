import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialFilterState = {
  search: "",
  searchStatus: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const initialState = {
  isLoading: false,
  items: [],
  totalItem: 0,
  numOfPages: 1,
  page: 1,
  ...initialFilterState,
};

const allItemsSlice = createSlice({
  name: "allitems",
  initialState,
});

export default allItemsSlice.reducer;

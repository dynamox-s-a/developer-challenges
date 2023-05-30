import { createSlice } from "@reduxjs/toolkit";

export interface NavState {
  value: boolean;
}

const initialState: NavState = { value: false };

export const navStateSlice = createSlice({
  name: "navState",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = navStateSlice.actions;
export default navStateSlice.reducer;

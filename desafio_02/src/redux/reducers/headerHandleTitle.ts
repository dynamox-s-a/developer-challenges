import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  dashboardTitle: "Produtos",
};

const headerHandleTitleSlice = createSlice({
  name: "headerHandleTitle",
  initialState: INITIAL_STATE,
  reducers: {
    setDashboardTitle(state, action) {
      state.dashboardTitle = action.payload;
    },
  },
});

export const { setDashboardTitle } = headerHandleTitleSlice.actions;

export default headerHandleTitleSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../../app/types/types'

const pageSlice = createSlice({
  name: "page",
  initialState: {
    activeComponent: "Daschboard", 
  },
  reducers: {
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { setActiveComponent } = pageSlice.actions;

export const selectActiveComponent = (state: RootState) => state.page.activeComponent;

export default pageSlice.reducer;

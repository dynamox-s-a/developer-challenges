import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export interface AxisSliceState {
  selectedAxis: "x" | "y" | "z"
}

const initialState: AxisSliceState = {
  selectedAxis: "x",
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const axisSlice = createAppSlice({
  name: "axis",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    changeAxis: create.reducer(
      (state, action: PayloadAction<"x" | "y" | "z">) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.selectedAxis = action.payload
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectAxis: axis => axis.selectedAxis,
  },
})

// Action creators are generated for each case reducer function.
export const { changeAxis } = axisSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAxis } = axisSlice.selectors

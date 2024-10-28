"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ConfiguracaoTema = {
  indexColor: number;
};

export const initialState: ConfiguracaoTema = {
  indexColor: 0,
};

const slice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    changeColor: (state, action: PayloadAction<number>) => {
      state.indexColor = action.payload;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export default slice.reducer;
export const { changeColor, reset } = slice.actions;

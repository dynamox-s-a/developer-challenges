"use client";
import { changeColor } from "@/app/redux/slices/Theme";
import { dispatch } from "@/app/redux/store";

export const changeColorPreset = (value: number) => {
  dispatch(changeColor(value));
};

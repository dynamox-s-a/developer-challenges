"use client";
export type CoresVariantes = {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export const presetsDeCores = [
  {
    name: "default",
    lighter: "#D1FFFC",
    light: "#9ADAF5",
    main: "#56C5F1",
    dark: "#0E77B7",
    darker: "#337ab7",
    contrastText: "#fff",
  },
  {
    name: "purple",
    lighter: "#EBD6FD",
    light: "#B985F4",
    main: "#7635dc",
    dark: "#431A9E",
    darker: "#200A69",
    contrastText: "#fff",
  },

  {
    name: "blue",
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#2065D1",
    dark: "#103996",
    darker: "#061B64",
    contrastText: "#fff",
  },
];

export type PresetsDeCores = "default" | "purple" | "cyan" | "blue";

export const defaultPreset = presetsDeCores[0];
export const purplePreset = presetsDeCores[1];
export const cyanPreset = presetsDeCores[2];
export const bluePreset = presetsDeCores[3];

export default function pegarPresetsCores(presetsKey: PresetsDeCores) {
  return {
    purple: purplePreset,
    cyan: cyanPreset,
    blue: bluePreset,
    default: defaultPreset,
  }[presetsKey];
}

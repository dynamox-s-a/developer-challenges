/**
 * The template palette adds a `neutral` scale and extra background levels on
 * top of the default MUI palette. Declaring them here keeps `sx` type-safe.
 */
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Record<number, string>;
  }
  interface PaletteOptions {
    neutral?: Record<number, string>;
  }
  interface TypeBackground {
    level1: string;
    level2: string;
    level3: string;
  }
}

export {};

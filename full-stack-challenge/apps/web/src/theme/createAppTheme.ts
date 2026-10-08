import { createTheme, type Theme } from '@mui/material/styles';
import type { ColorMode } from '../features/ui/uiSlice';

/** Series colours for charts, validated per mode (see palettes below). */
export interface ChartPalette {
  readings: string;
  forecast: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    chart: ChartPalette;
  }
  interface PaletteOptions {
    chart?: ChartPalette;
  }
}

/** Width of the navigation drawer from `md` up. */
export const DRAWER_WIDTH = 240;

/**
 * The only place colours are defined. Every pair below keeps text at 4.5:1
 * or more against its background (WCAG AA) in its own mode.
 */
const palettes = {
  light: {
    primary: { main: '#1565c0' }, // 5.7:1 with white text
    secondary: { main: '#00695c' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
    // Categorical slots 1-2 (blue, orange) of the dataviz reference palette,
    // checked with its validator on #ffffff: lightness band, chroma, CVD
    // separation (worst ΔE 24.7, protan) and >= 3:1 against the surface.
    chart: { readings: '#2a78d6', forecast: '#eb6834' },
  },
  dark: {
    primary: { main: '#90caf9' }, // over 9:1 with dark text and on the paper
    secondary: { main: '#80cbc4' },
    background: { default: '#0f1214', paper: '#171b1f' },
    // The same two hues stepped for the dark surface, validated on #171b1f
    // (worst ΔE 26.8, protan).
    chart: { readings: '#3987e5', forecast: '#d95926' },
  },
} as const;

export function createAppTheme(mode: ColorMode): Theme {
  return createTheme({
    palette: { mode, ...palettes[mode] },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Honour the OS setting: no animated transitions for users who
          // asked for less motion (drawer slide, ripples, progress).
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        },
      },
    },
  });
}

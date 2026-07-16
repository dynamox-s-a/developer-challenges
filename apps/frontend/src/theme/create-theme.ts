import type { Theme } from '@mui/material/styles';
import type { ThemeOptions } from './types';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { components } from './core/components';
import { customShadows } from './core/custom-shadows';
import { mixins } from './core/mixins';
import { opacity } from './core/opacity';
import { palette } from './core/palette';
import { shadows } from './core/shadows';
import { typography } from './core/typography';
import { themeConfig } from './theme-config';

export const baseTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
      opacity,
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
      opacity,
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
};

export function createTheme(themeOverrides: ThemeOptions = {}): Theme {
  return createMuiTheme(baseTheme, themeOverrides);
}

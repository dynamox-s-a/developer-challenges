import type { Theme, CSSObject, MixinsOptions } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { borderGradient } from './border';
import { maxLine, textGradient } from './text';
import { bgBlur, bgGradient } from './background';
import { softStyles, paperStyles, filledStyles, menuItemStyles } from './global-styles-components';

// ----------------------------------------------------------------------

/**
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../../extend-theme-types.d.ts}
 */

export type * from './text';
export type * from './border';
export type * from './background';
export type * from './global-styles-components';

export type MixinsExtend = {
  hideScrollX: CSSObject;
  hideScrollY: CSSObject;
  scrollbarStyles: (theme: Theme) => CSSObject;
  bgBlur: typeof bgBlur;
  maxLine: typeof maxLine;
  bgGradient: typeof bgGradient;
  softStyles: typeof softStyles;
  paperStyles: typeof paperStyles;
  textGradient: typeof textGradient;
  filledStyles: typeof filledStyles;
  borderGradient: typeof borderGradient;
  menuItemStyles: typeof menuItemStyles;
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const mixins: MixinsOptions = {
  hideScrollX: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  hideScrollY: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  scrollbarStyles: (theme: Theme): CSSObject => ({
    scrollbarWidth: 'thin',
    scrollbarColor: `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
  }),
  bgBlur,
  maxLine,
  bgGradient,
  softStyles,
  paperStyles,
  textGradient,
  filledStyles,
  borderGradient,
  menuItemStyles,
};

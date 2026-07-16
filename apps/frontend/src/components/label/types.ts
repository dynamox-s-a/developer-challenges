import type { LabelRoot } from './styles';
import type { PaletteColorKey, CommonColorsKeys } from 'src/theme/core';

// ----------------------------------------------------------------------

export type LabelColor = PaletteColorKey | CommonColorsKeys | 'default';

export type LabelVariant = 'filled' | 'outlined' | 'soft' | 'inverted';

export interface LabelProps extends React.ComponentProps<typeof LabelRoot> {
  disabled?: boolean;
  color?: LabelColor;
  variant?: LabelVariant;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

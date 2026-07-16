import type { Shadows } from '@mui/material/styles';
import type { SchemesRecord } from '../types';

import { varAlpha } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { grey, common } from './palette';

// ----------------------------------------------------------------------

function updateShadowColor(shadow: string, colorChannel: string): string {
  return shadow.replace(/rgba\(\d+,\d+,\d+,(.*?)\)/g, (_, alpha) =>
    varAlpha(colorChannel, parseFloat(alpha))
  );
}

function createShadows(colorChannel: string): Shadows {
  // Get default MUI shadows
  const { shadows: defaultShadows } = createTheme();

  return defaultShadows.map((shadow) => updateShadowColor(shadow, colorChannel)) as Shadows;
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const shadows: SchemesRecord<Shadows> = {
  light: createShadows(grey['500Channel']),
  dark: createShadows(common.blackChannel),
};

import type { PaletteOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { designColors, error, indigo, info, neutral, success, warning } from './colors';

export function createPalette(): PaletteOptions {
	return {
		action: {
			active: neutral[500],
			disabled: alpha(neutral[900], 0.38),
			disabledBackground: alpha(neutral[900], 0.12),
			focus: alpha(neutral[900], 0.16),
			hover: alpha(neutral[900], 0.04),
			selected: alpha(neutral[900], 0.12),
		},
		background: {
			default: designColors.background,
			paper: designColors.paper,
		},
		divider: designColors.border,
		error,
		info,
		mode: 'light',
		primary: indigo,
		success,
		text: {
			primary: designColors.text,
			secondary: designColors.axisLabel,
			disabled: alpha(neutral[900], 0.38),
		},
		warning,
	};
}

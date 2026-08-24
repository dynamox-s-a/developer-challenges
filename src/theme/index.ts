import { createTheme as createMuiTheme } from '@mui/material/styles';
import { createComponents } from './createComponents';
import { createPalette } from './createPalette';
import { createShadows } from './createShadows';
import { createTypography } from './createTypography';

export function createAppTheme() {
	const palette = createPalette();
	const shadows = createShadows();
	const typography = createTypography();

	const baseTheme = createMuiTheme({
		breakpoints: {
			values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 },
		},
		palette,
		shadows,
		shape: { borderRadius: 4 },
		typography,
	});

	const components = createComponents(baseTheme.palette);

	return createMuiTheme(baseTheme, { components });
}

export const theme = createAppTheme();

import { alpha } from '@mui/material/styles';

export const designColors = {
	background: '#F8FAFC',
	paper: '#FFFFFF',
	border: '#DFE3E8',
	text: '#3A3B3F',
	axisLabel: '#6673A9',
	chart: {
		x: '#2386CB',
		y: '#CC337D',
		z: '#B48A00',
		temperature: '#89982E',
	},
} as const;

interface ColorInput {
	lightest: string;
	light: string;
	main: string;
	dark: string;
	darkest: string;
	contrastText: string;
}

interface ColorWithAlphas extends ColorInput {
	alpha4: string;
	alpha8: string;
	alpha12: string;
	alpha30: string;
	alpha50: string;
}

const withAlphas = (color: ColorInput): ColorWithAlphas => {
	return {
		...color,
		alpha4: alpha(color.main, 0.04),
		alpha8: alpha(color.main, 0.08),
		alpha12: alpha(color.main, 0.12),
		alpha30: alpha(color.main, 0.3),
		alpha50: alpha(color.main, 0.5),
	};
};

export const neutral = {
	50: '#F8F9FA',
	100: '#F3F4F6',
	200: '#E5E7EB',
	300: '#D2D6DB',
	400: '#9DA4AE',
	500: '#6C737F',
	600: '#4D5761',
	700: '#2F3746',
	800: '#1C2536',
	900: '#111927',
};

export const indigo = withAlphas({
	lightest: '#F5F7FF',
	light: '#EBEEFE',
	main: '#692746',
	dark: '#300017',
	darkest: '#2b1d24',
	contrastText: '#FFFFFF',
});

export const success = withAlphas({
	lightest: '#F0FDF9',
	light: '#3FC79A',
	main: '#10B981',
	dark: '#0B815A',
	darkest: '#134E48',
	contrastText: '#FFFFFF',
});

export const info = withAlphas({
	lightest: '#ECFDFF',
	light: '#CFF9FE',
	main: '#06AED4',
	dark: '#0E7090',
	darkest: '#164C63',
	contrastText: '#FFFFFF',
});

export const warning = withAlphas({
	lightest: '#FFFAEB',
	light: '#FEF0C7',
	main: '#F79009',
	dark: '#B54708',
	darkest: '#7A2E0E',
	contrastText: '#FFFFFF',
});

export const error = withAlphas({
	lightest: '#FEF3F2',
	light: '#FEE4E2',
	main: '#F04438',
	dark: '#B42318',
	darkest: '#7A271A',
	contrastText: '#FFFFFF',
});

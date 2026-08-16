import type { Components, Theme } from '@mui/material';
import { paperClasses, tableCellClasses } from '@mui/material';

export function createComponents(palette: Theme['palette']): Components<Theme> {
	return {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					textTransform: 'none',
				},
				sizeSmall: {
					padding: '6px 16px',
				},
				sizeMedium: {
					padding: '8px 20px',
				},
				sizeLarge: {
					padding: '11px 24px',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					border: `1px solid ${palette.divider}`,
					borderRadius: 4,
					[`&.${paperClasses.elevation1}`]: {
						boxShadow: 'none',
					},
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: 24,
					'&:last-child': {
						paddingBottom: 24,
					},
				},
			},
		},
		MuiCardHeader: {
			defaultProps: {
				titleTypographyProps: { variant: 'h6' },
				subheaderTypographyProps: { variant: 'body2' },
			},
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${palette.divider}`,
					padding: '19px 24px',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				rounded: {
					borderRadius: 4,
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				'*': { boxSizing: 'border-box' },
				':where(a, button, [tabindex]):focus-visible': {
					outline: `2px solid ${palette.primary.main}`,
					outlineOffset: 2,
				},
				html: {
					MozOsxFontSmoothing: 'grayscale',
					WebkitFontSmoothing: 'antialiased',
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100%',
					width: '100%',
				},
				body: {
					display: 'flex',
					flex: '1 1 auto',
					flexDirection: 'column',
					minHeight: '100%',
					width: '100%',
				},
				'#root': {
					display: 'flex',
					flex: '1 1 auto',
					flexDirection: 'column',
					height: '100%',
					width: '100%',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottomColor: palette.divider,
					padding: '15px 16px',
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					borderBottom: 'none',
					[`& .${tableCellClasses.root}`]: {
						borderBottom: 'none',
						backgroundColor: palette.grey[50],
						color: palette.grey[700],
						fontSize: 12,
						fontWeight: 600,
						lineHeight: 1,
						letterSpacing: 0.5,
						textTransform: 'uppercase',
					},
					[`& .${tableCellClasses.paddingCheckbox}`]: {
						paddingTop: 4,
						paddingBottom: 4,
					},
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontSize: 14,
					fontWeight: 500,
					lineHeight: 1.71,
					minWidth: 'auto',
					paddingLeft: 0,
					paddingRight: 0,
					textTransform: 'none',
					'& + &': {
						marginLeft: 24,
					},
				},
			},
		},
	};
}

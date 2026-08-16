export function createTypography() {
	return {
		fontFamily: '"Roboto", Arial, sans-serif',
		body1: {
			fontSize: '0.875rem',
			fontWeight: 400,
			lineHeight: 1.5,
			letterSpacing: '-0.05px',
		},
		body2: {
			fontSize: '0.75rem',
			fontWeight: 400,
			lineHeight: '14px',
			letterSpacing: '-0.04px',
		},
		button: {
			fontSize: '0.875rem',
			fontWeight: 500,
			textTransform: 'none' as const,
		},
		caption: {
			fontSize: '0.75rem',
			fontWeight: 400,
			lineHeight: '14px',
		},
		subtitle1: {
			fontSize: '0.875rem',
			fontWeight: 500,
			lineHeight: '20px',
		},
		subtitle2: {
			fontSize: '0.75rem',
			fontWeight: 500,
			lineHeight: '14px',
		},
		overline: {
			fontSize: '0.75rem',
			fontWeight: 500,
			letterSpacing: '0.5px',
			lineHeight: 2.5,
			textTransform: 'uppercase' as const,
		},
		h1: {
			fontWeight: 500,
			fontSize: '2.5rem',
			lineHeight: 1.2,
		},
		h2: {
			fontWeight: 500,
			fontSize: '2rem',
			lineHeight: 1.2,
		},
		h3: {
			fontWeight: 500,
			fontSize: '1.5rem',
			lineHeight: 1.2,
		},
		h4: {
			fontSize: '1.25rem',
			fontWeight: 500,
			lineHeight: '24px',
			letterSpacing: '-0.06px',
		},
		h5: {
			fontSize: '1rem',
			fontWeight: 500,
			lineHeight: '22px',
		},
		h6: {
			fontSize: '0.875rem',
			fontWeight: 500,
			lineHeight: '20px',
			letterSpacing: '-0.05px',
		},
	};
}

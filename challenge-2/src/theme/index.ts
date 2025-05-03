"use client";

import { createTheme } from "@mui/material";

// --color-primary: #692746;
// --color-primary-50: #faeef2;
// --color-primary-100: #eec6d5;
// --color-primary-200: #e292b2;
// --color-primary-300: #d45792;
// --color-primary-400: #9d3e6b;
// --color-primary-500: #391224;
// --font-sans: var(--font-geist-sans);
// --font-mono: var(--font-geist-mono);

export const theme = createTheme({
	cssVariables: true,
	palette: {
		primary: {
			main: "#692746",
			"50": "#faeef2",
			"100": "#eec6d5",
			"200": "#e292b2",
			"300": "#d45792",
			"400": "#9d3e6b",
			"500": "#391224",
		},
	},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "#692746",
						},
						"&:hover fieldset": {
							borderColor: "#692746",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#692746",
						},
					},
					"& .MuiInputLabel-root": {
						color: "#692746",
						"&.Mui-focused": {
							color: "#692746",
						},
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "#692746",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "#692746",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "#692746",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "#692746",
					"&.Mui-focused": {
						color: "#692746",
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderColor: "#692746",
					color: "#692746",
					"&:hover": {
						borderColor: "#692746",
						backgroundColor: "#faeef2",
					},
				},
			},
		},
	},
});

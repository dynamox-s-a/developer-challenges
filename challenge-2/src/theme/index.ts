"use client";

import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		primary: {
			main: "var(--color-primary)",
			"50": "var(--color-primary-50)",
			"100": "var(--color-primary-100)",
			"200": "var(--color-primary-200)",
			"300": "var(--color-primary-300)",
			"400": "var(--color-primary-400)",
			"500": "var(--color-primary-500)",
		},
	},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "var(--color-primary)",
						},
						"&:hover fieldset": {
							borderColor: "var(--color-primary)",
						},
						"&.Mui-focused fieldset": {
							borderColor: "var(--color-primary)",
						},
					},
					"& .MuiInputLabel-root": {
						color: "var(--color-primary)",
						"&.Mui-focused": {
							color: "var(--color-primary)",
						},
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "var(--color-primary)",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "var(--color-primary)",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "var(--color-primary)",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "var(--color-primary)",
					"&.Mui-focused": {
						color: "var(--color-primary)",
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderColor: "var(--color-primary)",
					color: "var(--color-primary)",
					"&:hover": {
						borderColor: "var(--color-primary)",
						backgroundColor: "var(--color-primary-50)",
					},
				},
			},
		},
	},
});

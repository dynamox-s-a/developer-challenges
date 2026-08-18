import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	},
	palette: {
		background: {
			default: "#f2f2f2",
			paper: "#ffffff",
		},
	},
});

export default theme;

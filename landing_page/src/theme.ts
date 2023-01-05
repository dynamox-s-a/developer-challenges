import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Raleway, sans-serif",
  },
  palette: {
    primary: {
      main: "#263252",
    },
  },
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: `
  //       @font-face {
  //         font-family: 'Raleway';
  //         font-style: normal;
  //         font-weight: 400;
  //       }
  //     `,
  //   },
  // },
});

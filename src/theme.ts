import { createTheme, PaletteOptions } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const typography: TypographyOptions = {
  fontFamily: [
    'Inter',
  ].join(','),
  fontWeightRegular: 400,
}

const palette: PaletteOptions = {
  primary: {
    main: '#692746',
    contrastText: '#fff',
  },
  background: {
    default: '#fff'
  }
}

export const theme = createTheme({
  palette,
  typography,
})


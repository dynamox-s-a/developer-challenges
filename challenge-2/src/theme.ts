'use client'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }

  interface TypographyVariants {
    customTitle: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    customTitle?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    customTitle: true
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#692746',
    },
    secondary: {
      main: '#692746',
    },
    background: {
      default: '#F9F9F9',
    },
    text: {
      primary: '#333333',
      secondary: '#454444',
      disabled: '#757575',
      // hint: '#692746',
    },
    // neutral: {
    //   main: '#64748B',
    //   contrastText: '#fff',
    // },
  },
  typography: {
    fontFamily: '"Gilroy", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '6rem',
      // fontWeight: 700, // usa Gilroy-Bold
    },
    customTitle: {
      fontSize: '2rem',
      // fontWeight: 600, // usa Gilroy-SemiBold
    },
  },
})

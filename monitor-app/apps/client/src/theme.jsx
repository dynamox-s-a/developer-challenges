'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e3552',
      dark: '#66788a',
      contrastText: '#fff'
    },
    secondary: {
      main: '#44142d'
    },
    background: {
      default: '#fbfbfb',
      paper: '#fff'
    }
  }
})

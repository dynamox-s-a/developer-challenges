import { createTheme } from '@mui/material/styles'
import type { CSSProperties } from 'react'

declare module '@mui/material/styles' {
  interface Theme {
    border: {
      default: string
    }
    chart: {
      textColor: string
    }
    layout: {
      maxContentWidth: string
    }
  }

  interface ThemeOptions {
    border?: {
      default?: string
    }
    chart?: {
      textColor?: string
    }
    layout?: {
      maxContentWidth?: string
    }
  }

  interface TypographyVariants {
    chartLegend: CSSProperties
  }

  interface TypographyVariantsOptions {
    chartLegend?: CSSProperties
  }
}

export const theme = createTheme({
  border: {
    default: '#DFE3E8',
  },
  chart: {
    textColor: '#6673A9',
  },
  layout: {
    maxContentWidth: '91.5rem',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#3A3B3F',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#3A3B3F',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.00075rem',
      lineHeight: '1.5rem',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '-0.0004375rem',
      lineHeight: '1.25rem',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '-0.0004375rem',
      lineHeight: '1.3125rem',
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '-0.0003rem',
      lineHeight: '0.875rem',
    },
    chartLegend: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '-0.000375rem',
      lineHeight: '0.9rem',
    },
  },
})

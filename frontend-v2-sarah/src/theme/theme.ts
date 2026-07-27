import { createTheme, responsiveFontSizes } from '@mui/material/styles';
declare module '@mui/material/styles' {
  interface TypographyVariants {
    chartLegend: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    chartLegend?: React.CSSProperties;
  }
  interface Palette {
    charts: {
      accelerationX: string;
      accelerationY: string;
      accelerationZ: string;
      temperature: string;
      velocityX: string;
      velocityY: string;
      velocityZ: string;
    };
  }
  interface PaletteOptions {
    charts?: {
      accelerationX?: string;
      accelerationY?: string;
      accelerationZ?: string;
      temperature?: string;
      velocityX?: string;
      velocityY?: string;
      velocityZ?: string;
    };
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    chartLegend: true;
  }
}

let theme = createTheme({
  palette: {
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#3A3B3F',
      secondary: '#6673A9',
    },
    grey: {
      100: '#F8FAFC',
      500: '#DFE3E8',
    },
    charts: {
      accelerationX: '#2386CB',
      accelerationY: '#CC337D',
      accelerationZ: '#B48A00',
      temperature: '#89982E',
      velocityX: '#2386CB',
      velocityY: '#CC337D',
      velocityZ: '#B48A00',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 12,

    // H4 (20px)
    h4: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.67rem',
      lineHeight: '1.2',
      color: '#3A3B3F',
    },

    // H6 (14px)
    h6: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.17rem',
      lineHeight: '1.4',
      color: '#3A3B3F',
    },

    // Body 1 (14px)
    body1: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '1.17rem',
      lineHeight: '1.5',
      color: '#3A3B3F',
    },

    // Body 2 (12px)
    body2: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.4',
      color: '#6673A9',
    },

    // (12px)
    chartLegend: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '1.2',
      color: '#3A3B3F',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

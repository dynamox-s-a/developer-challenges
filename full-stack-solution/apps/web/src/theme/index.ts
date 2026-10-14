import { createTheme, type Theme } from "@mui/material/styles";
import {
  california,
  kepple,
  neonBlue,
  redOrange,
  shakespeare,
  stormGrey,
} from "./colors";
import { shadows } from "./shadows";
import { typography } from "./typography";

/**
 * Application theme.
 *
 * Tokens (colors, typography, shadows, radii) and the component overrides are
 * adapted from the Devias Material Kit React template (MIT), rewritten for
 * Material UI 5: the template targets MUI 7 CSS variables
 * (`var(--mui-palette-*)`), which do not exist in MUI 5, so every reference was
 * replaced by a `theme`-based value.
 *
 * Only a light scheme is provided — the challenge does not ask for a dark mode
 * and a second scheme would double the styling surface with no requirement
 * behind it.
 */
export const theme: Theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
  shape: { borderRadius: 8 },
  shadows,
  typography,
  palette: {
    mode: "light",
    action: { disabledBackground: "rgba(0, 0, 0, 0.06)" },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
      level1: stormGrey[50],
      level2: stormGrey[100],
      level3: stormGrey[200],
    },
    divider: stormGrey[200],
    neutral: stormGrey,
    primary: {
      light: neonBlue[400],
      main: neonBlue[500],
      dark: neonBlue[600],
      contrastText: "#ffffff",
    },
    secondary: {
      light: stormGrey[600],
      main: stormGrey[700],
      dark: stormGrey[800],
      contrastText: "#ffffff",
    },
    error: {
      light: redOrange[400],
      main: redOrange[500],
      dark: redOrange[600],
      contrastText: "#ffffff",
    },
    warning: {
      light: california[400],
      main: california[500],
      dark: california[600],
      contrastText: "#ffffff",
    },
    info: {
      light: shakespeare[400],
      main: shakespeare[500],
      dark: shakespeare[600],
      contrastText: "#ffffff",
    },
    success: {
      light: kepple[400],
      main: kepple[500],
      dark: kepple[600],
      contrastText: "#ffffff",
    },
    text: {
      primary: stormGrey[900],
      secondary: stormGrey[500],
      disabled: stormGrey[400],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": { height: "100%" },
        "*:focus-visible": { outline: `2px solid ${neonBlue[500]}` },
      },
    },
    MuiLink: { defaultProps: { underline: "hover" } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: "12px", textTransform: "none" },
        sizeSmall: { padding: "6px 16px" },
        sizeMedium: { padding: "8px 20px" },
        sizeLarge: { padding: "11px 24px" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          "&.MuiPaper-elevation1": {
            boxShadow:
              "0 5px 22px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: { variant: "body2" },
      },
      styleOverrides: { root: { padding: "24px 24px 8px" } },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: "24px", "&:last-child": { paddingBottom: "24px" } },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: stormGrey[50],
            color: stormGrey[500],
            lineHeight: 1,
            whiteSpace: "nowrap",
          },
        },
      },
    },
  },
});

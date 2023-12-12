import { inputLabelClasses, paperClasses } from "@mui/material";
import { indigo, neutral } from "./colors";

export function createComponents(config: { palette: any }) {
  const { palette } = config;

  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: indigo.main,
          color: neutral[50],
          padding: 10,
          width: 300,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              "0px 5px 22px rgba(0, 0, 0, 0.25), 0px 0px 0px 0.5px rgba(37, 50, 82, 0.356)",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: palette.primary.main,
          color: palette.primary.lightest,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "80vw !important",
          maxHeight: "80vh !important"
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          [`&.${inputLabelClasses.filled}`]: {
            transform: "translate(12px, 18px) scale(1)",
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: "translate(0, -1.5px) scale(0.85)",
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: "translate(12px, 6px) scale(0.85)",
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: "translate(14px, -9px) scale(0.85)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          padding: "10px 20px",
        },
      },
      defaultProps: {
        variant: "contained",
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "3px solid #131235",
          padding: 16,
          margin: 16,
          boxShadow:
            "0px 5px 22px rgba(0, 0, 0, 0.534), 0px 0px 0px 0.5px rgba(37, 50, 82, 0.356)",
        },
        sortIcon: {
          color: "#F4F7FC",
        },
      },
    },
  };
}

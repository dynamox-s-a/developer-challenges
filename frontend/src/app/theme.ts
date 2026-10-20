import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: { default: "#F8F9FA", paper: "#FFFFFF" },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily:
      '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
  },
  components: {
    MuiCard: { defaultProps: { variant: "outlined" } },
  },
});

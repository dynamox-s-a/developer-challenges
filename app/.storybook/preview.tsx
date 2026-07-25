import type { Preview } from "@storybook/react-vite";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "../src/styles.css";

const theme = createTheme({
  typography: { fontFamily: "Manrope, Arial, sans-serif" },
  palette: { primary: { main: "#5b4bcc" } },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: 24, background: "#f6f7fa" }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
};

export default preview;

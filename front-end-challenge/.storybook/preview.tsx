import type { Preview } from "@storybook/nextjs";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      autodocs: "tag",
    },
  },

  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: "1rem" }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;

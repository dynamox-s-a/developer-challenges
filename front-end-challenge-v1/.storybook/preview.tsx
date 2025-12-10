import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Preview } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";
import { makeStore } from "../src/lib/store";
import { theme } from "../src/lib/theme";

// Create a store for Storybook
const store = makeStore();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </Provider>
    ),
  ],
};

export default preview;

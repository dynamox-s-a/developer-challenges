"use client";

// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@mui/material";
import { theme } from "../src/theme";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		nextjs: {
			appDirectory: true,
			navigation: {
				push: () => Promise.resolve(),
			},
		},
	},
	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<Story />
			</ThemeProvider>
		),
	],
};

export default preview;

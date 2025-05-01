"use client";

import { store } from "@/store";
import { theme } from "@/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Provider as ReduxProvider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ReduxProvider store={store}>
			<AppRouterCacheProvider>
				<ThemeProvider theme={theme}>{children}</ThemeProvider>
			</AppRouterCacheProvider>
		</ReduxProvider>
	);
}

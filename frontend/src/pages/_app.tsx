import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import store from "@/store/store";
import { Provider } from "react-redux";
import { ThemeContextProvider } from "@/context/ThemeProvider";
import { darkTheme } from "@/styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        {isLoginPage ? (
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        ) : (
          <ThemeContextProvider>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeContextProvider>
        )}
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;

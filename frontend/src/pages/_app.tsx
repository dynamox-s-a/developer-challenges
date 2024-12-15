import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeContextProvider } from "@/context/ThemeProvider";
import Layout from "@/components/layout";
import { darkTheme } from "@/styles/theme";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material/styles";
import store from "@/store/store";
import { Provider } from "react-redux";

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

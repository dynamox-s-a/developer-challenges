// pages/_app.tsx
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../../utils/createEmotionCache";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Provider } from "react-redux";
import { store } from "../../store/store";

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme();
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <UserProvider>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </UserProvider>
  );
}

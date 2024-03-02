// import 'simplebar-react/dist/simplebar.min.css';
import Head from 'next/head';
import { FC, ReactNode } from 'react';
import { Provider } from "react-redux";
import { createTheme } from '../styles';
import { store } from '../lib/redux/store';
import { CssBaseline } from '@mui/material';
import { useSession } from "next-auth/react";
import type { NextComponentType } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import AuthProvider from '../providers/AuthProvider';
import { useNProgress } from '../hooks/useNProgress';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import faviconImg from '../../public/dynamox-icon.png';

const clientSideEmotionCache: EmotionCache = createEmotionCache();

export interface MyAppProps extends AppLayoutProps {
  emotionCache: EmotionCache
}

const SplashScreen = () => null;

const App: NextComponentType<AppContext, AppInitialProps, MyAppProps>= (props: MyAppProps): JSX.Element => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  const theme = createTheme();

  const WrapperContent: FC = (): JSX.Element => {
    const { status } = useSession();
    return (
      <>
        {
          status === "loading"
            ? <SplashScreen />
            : getLayout(<Component {...pageProps} />)
        }
      </>
    )
	};

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Dynamox
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <link rel='icon' href={faviconImg.src} />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <WrapperContent />
            </ThemeProvider>
          </Provider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;

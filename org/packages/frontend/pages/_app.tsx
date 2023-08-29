import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import { useMemo, ReactElement, ReactNode } from 'react';
import RouteGuard from 'hocs/auth-guard';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import 'simplebar-react/dist/simplebar.min.css';

import { createTheme } from 'theme';

type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const theme = createTheme();

  const isPublicRoute = router.asPath === '/login';

  const renderContent = useMemo(() => {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page);

    const component = <>{getLayout(<Component {...pageProps} />)}</>;

    if (isPublicRoute) {
      return component;
    }

    return <RouteGuard>{component}</RouteGuard>;
  }, [Component, pageProps, isPublicRoute]);
  return (
    <>
      <Head>
        <title>Welcome to frontend!</title>
      </Head>
      <main className="app">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>{renderContent}</Provider>
        </ThemeProvider>
      </main>
    </>
  );
}

export default CustomApp;

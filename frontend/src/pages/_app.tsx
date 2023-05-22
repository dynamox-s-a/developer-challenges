import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '@/styles/theme';
import { Provider } from 'react-redux';
import store from '../store';

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps}/>
          </ThemeProvider>
        </Provider>
}

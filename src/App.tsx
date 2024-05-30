import { Provider as ReduxProvider } from 'react-redux';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { globalStyles } from './styles/globalStyles';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
// import { eduStore } from './edu/eduStore';
import { store } from './store';

export function App() {
  return (
    <>
      <ReduxProvider store={store}>
          <Global styles={globalStyles} />
          <MUIThemeProvider theme={theme}>
            <EmotionThemeProvider theme={theme}>
              <HelmetProvider>
                <Helmet titleTemplate='%s | Dynamox' />
                {/* AppRouter: */}
                <RouterProvider router={router} />

              </HelmetProvider>
            </EmotionThemeProvider>
          </MUIThemeProvider>
      </ReduxProvider>
    </>
  )
}
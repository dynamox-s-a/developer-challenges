import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme'
import { CssBaseline } from '@mui/material';
import { injectRouter, injectStore } from './api/client';
import * as Sentry from '@sentry/react';

// Font Import
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { initSentry } from './utils/sentry';

injectStore(store)
injectRouter(router)

initSentry()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
  {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  }
);

root.render(
  <StrictMode>
      <ThemeProvider theme={theme}>...
         <CssBaseline />
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { router } from './routes';
import { store } from './store';
import { ThemeProvider } from './theme';

import '@fontsource-variable/dm-sans';
import '@fontsource-variable/public-sans';
import './global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

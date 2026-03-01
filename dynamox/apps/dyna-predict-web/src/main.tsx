import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { router } from './router';
import { Provider } from 'react-redux';

// Font Import
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
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

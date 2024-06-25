import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './useAuth';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import './index.css';
import { CssBaseline } from '@mui/material';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Provider store={store}>
            <CssBaseline>
              <App />
            </CssBaseline>
          </Provider>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}

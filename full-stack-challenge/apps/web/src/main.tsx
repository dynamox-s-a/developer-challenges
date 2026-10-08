import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { store } from './app/store';
import { fetchMe } from './features/auth/authSlice';

// Hydrate the session from the cookie once, before the first render, so
// PrivateRoute can wait for the answer instead of redirecting to /login.
void store.dispatch(fetchMe());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

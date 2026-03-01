import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { createBrowserRouter } from 'react-router-dom';

import type { AppStore } from '../store/store';

type RemixRouter = ReturnType<typeof createBrowserRouter>;

let store: AppStore;
let router: RemixRouter;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const injectRouter = (_router: RemixRouter) => {
  router = _router;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      const isAuthRequest =
        error.config?.url?.includes('/login') ||
        error.config?.url?.includes('/logout') ||
        error.config?.url?.includes('/me');

      if (isAuthRequest) return Promise.reject(error);

      store.dispatch({ type: 'auth/logout/fulfilled' });
      router.navigate('/auth/login');
    }

    return Promise.reject(error);
  },
);

export default api;

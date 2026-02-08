import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import { Provider } from 'react-redux';

const router = createBrowserRouter(routes);

import { store } from '@/store/store'
import { AuthInitializer } from '@/components/auth/auth-initializer';

export function App() {
  return (
    <>
      <Provider store={store}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </React.Suspense>
      </Provider>
    </>
  );
}

export default App;

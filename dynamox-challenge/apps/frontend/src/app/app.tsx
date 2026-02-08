import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';

const router = createBrowserRouter(routes);


import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/store/auth/auth.api';
import { logout, setUser } from '@/store/auth/auth.slice';
import type { RootState } from '@/store/store';

export function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const { data: user, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  React.useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
    if (error) {
      dispatch(logout());
    }
  }, [user, error, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default App;

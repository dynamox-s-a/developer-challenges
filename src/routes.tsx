import { RouterProvider, createBrowserRouter } from 'react-router'
import { Home } from './pages/home/home'
import { NotFound } from './pages/not-found'
import { AppLayout } from './layout/app-layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [{ path: '/', element: <Home /> }],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export function Routes() {
  return <RouterProvider router={router} />
}

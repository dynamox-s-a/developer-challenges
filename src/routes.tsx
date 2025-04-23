import { RouterProvider, createBrowserRouter } from 'react-router'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export function Routes() {
  return <RouterProvider router={router} />
}

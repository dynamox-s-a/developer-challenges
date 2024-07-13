import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { Data } from './routes/Data'
import { Navbar } from './components/Navbar'


const router = createBrowserRouter([
  {
    path: '/',
    element: <></>,
  },
  {
    path: '/data',
    element: <Data />
  }
])


function App() {

  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  )
}

export default App

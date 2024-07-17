import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Box } from '@mui/material'

import { Data } from '@/routes/Data'
import { Home } from '@/routes/Home'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

import './App.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/data',
    element: <Data />
  }
])

function App() {

  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
    >
      <Navbar />
      <Box
        component='main'
        flexGrow={1}
        display='flex'
        flexDirection='column'
      >
        <RouterProvider router={router} />
      </Box>
      <Footer />
    </Box>
  )
}

export default App

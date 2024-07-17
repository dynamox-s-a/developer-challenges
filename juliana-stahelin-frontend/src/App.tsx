import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Box } from '@mui/material'

import { Data } from './routes/Data'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

import './App.css'


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
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
    >
      <Navbar />
      <Box
        component='main'
        flexGrow={1}
      >
        <RouterProvider router={router} />
      </Box>
      <Footer />
    </Box>
  )
}

export default App

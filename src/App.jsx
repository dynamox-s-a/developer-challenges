import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ErrorBoundary from './routes/components/ErrorBoundary'
import { Routes } from './routes/Routes'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'

export const App = () => {
  const client = new QueryClient()
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-left" />
      <ErrorBoundary>
        <QueryClientProvider client={client}>
          <Routes />
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

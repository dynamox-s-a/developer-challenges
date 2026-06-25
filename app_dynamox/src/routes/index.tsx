import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import MachineDashboard from '../pages/MachineDashboard'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/data" replace /> },
            { path: 'data', element: <MachineDashboard /> },
            { path: '*', element: <Navigate to="/data" replace /> },
        ],
    },
])

export default router

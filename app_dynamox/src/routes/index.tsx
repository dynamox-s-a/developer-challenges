import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import MachineDashboard from '../pages/MachineDashboard'
import MachineList from '../pages/MachineList'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <MachineList /> },
            { path: 'data', element: <MachineDashboard /> },
            { path: '*', element: <Navigate to="/" replace /> },
        ],
    },
])

export default router

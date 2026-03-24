import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

import PrivateRoute from './PrivateRoute'
import AppShell from '../components/layout/AppShell'

import LoginPage from '../pages/LoginPage'
import MachinesPage from '../pages/MachinesPage'
import MonitoringPointsPage from '../pages/MonitoringPointsPage'
import SensorsPage from '../pages/SensorsPage'

export default function AppRoutes() {
    const token = useAppSelector((s) => s.auth.token)

    return (
        <Routes>
            <Route path="/login" element={token ? <Navigate to="/machines" replace /> : <LoginPage />} />

            <Route element={<PrivateRoute />}>
                <Route element={<AppShell />}>
                    <Route path="/" element={<Navigate to="/machines" replace />} />
                    <Route path="/machines" element={<MachinesPage />} />
                    <Route path="/monitoring-points" element={<MonitoringPointsPage />} />
                    <Route path="/sensors" element={<SensorsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={token ? '/machines' : '/login'} replace />} />
        </Routes>
    )
}

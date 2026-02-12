import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AppLayout } from '../layouts/AppLayout'
import { SelectMachinePage } from '../pages/SelectMachinePage'
import { MonitoringPointsPage } from '../pages/MonitoringPointsPage'
import { SensorsPage } from '../pages/SensorsPage'
import { TelemetryPage } from '../pages/TelemetryPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route path='/app' element={<AppLayout />}>
          <Route index element={<SelectMachinePage />} />
          <Route
            path='machines/:machineId/monitoring-points'
            element={<MonitoringPointsPage />}
          />
          <Route path='machines/:machineId/sensors' element={<SensorsPage />} />
          <Route
            path='machines/:machineId/telemetry'
            element={<TelemetryPage />}
          />
        </Route>
      </Route>
      <Route path='/' element={<Navigate to='/app' replace />} />
      <Route path='*' element={<Navigate to='/app' replace />} />
    </Routes>
  )
}

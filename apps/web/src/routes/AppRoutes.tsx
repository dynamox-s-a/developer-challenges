import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<DashboardPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

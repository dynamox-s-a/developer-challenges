import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectIsAuthenticated } from '../features/auth/authSelectors'

export function PrivateRoute() {
  const isAuth = useAppSelector(selectIsAuthenticated)
  return isAuth ? <Outlet /> : <Navigate to='/login' replace />
}

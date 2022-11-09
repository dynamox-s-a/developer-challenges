import { Navigate, Outlet } from 'react-router-dom'

export const PublicRoute = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/produtos" replace />
  }

  return <Outlet />
}

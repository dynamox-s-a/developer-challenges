import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export default function PrivateRoute() {
    const token = useAppSelector((s) => s.auth.token)
    if (!token) return <Navigate to="/login" replace />
    return <Outlet />
}

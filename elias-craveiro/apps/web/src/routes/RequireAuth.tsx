import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { isJwtValid } from '../auth/jwt';

export default function RequireAuth() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const token = useAppSelector((s) => s.auth.accessToken);

    if (!isJwtValid(token)) {
        dispatch(logout()); // limpa storage/estado
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

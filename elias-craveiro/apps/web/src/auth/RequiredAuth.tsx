import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isJwtValid } from './jwt';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { api } from '../api/client';

export default function RequireAuth() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const token = useAppSelector((s) => s.auth.accessToken);

    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            // 1) check local token + exp
            if (!isJwtValid(token)) {
                dispatch(logout());
                if (mounted) {
                    setAllowed(false);
                    setChecking(false);
                }
                return;
            }

            // 2) opcional: ping no backend pra garantir token ainda aceito
            // (bom caso você implemente revogação no futuro)
            try {
                await api.get('/health'); // rota privada? se /health for pública, cria /auth/me ou /auth/validate
                if (mounted) setAllowed(true);
            } catch {
                dispatch(logout());
                if (mounted) setAllowed(false);
            } finally {
                if (mounted) setChecking(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [token, dispatch]);

    if (checking) return null; // ou um spinner

    if (!allowed) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

// "Porteiro" do front: sem token, manda para o login lembrando de onde o
// usuário veio (com o ?filtro=..., se tiver), para voltar para lá depois
export function RequireAuth() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  // Tem token: mostra a rota filha (no nosso caso, o layout com as páginas)
  return <Outlet />;
}
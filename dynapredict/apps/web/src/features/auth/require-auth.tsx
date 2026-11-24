import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCurrentUser } from './auth.slice';

// "Porteiro" do front: sem token, manda para o login lembrando de onde o
// usuário veio (com o ?filtro=..., se tiver), para voltar para lá depois
export function RequireAuth() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);

  // Tem token, mas não sabemos quem é o usuário (ex.: depois de um F5)?
  // Pergunta para a API. Se o token não valer mais, ela responde 401 e o
  // interceptor do api-client desloga
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  if (!token) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  // Tem token: mostra a rota filha (no nosso caso, o layout com as páginas)
  return <Outlet />;
}

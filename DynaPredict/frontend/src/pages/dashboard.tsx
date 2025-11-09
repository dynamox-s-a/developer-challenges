import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth-slice";
import type { RootState } from "../features/store";
import { Link } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const { isLogged, access_token } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Página Inicial</h1>
      {isLogged ? (
        <>
          <p>Você está logado ✅</p>
          <p>
            Token atual:{" "}
            {access_token ? `${access_token.slice(0, 20)}...` : "---"}
          </p>
          <button onClick={() => dispatch(logout())}>Sair</button>
          <br />
          <Link to="/protected">Ir para rota protegida</Link>
        </>
      ) : (
        <>
          <p>Você não está logado ❌</p>
          <Link to="/login">Fazer login</Link> |{" "}
          <Link to="/register">Criar conta</Link>
        </>
      )}
    </div>
  );
}

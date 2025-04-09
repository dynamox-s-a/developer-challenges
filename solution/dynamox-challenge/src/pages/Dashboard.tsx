// src/pages/Dashboard.tsx
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Ação de logout que limpa o estado
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <div>
      <h1>Bem-vinda ao Dashboard!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchMachines } from '../redux/actions';
import { RootState, AppDispatch } from '../redux/store'; 
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); 
  const username = useSelector((state: RootState) => state.user); 
  const machines = useSelector((state: RootState) => state.machines);
  const isLoading = useSelector((state: RootState) => state.isLoading); 
  const error = useSelector((state: RootState) => state.error);

  useEffect(() => {
    if (username) {
      dispatch(fetchMachines(machines));
    }
  }, [dispatch, username, machines]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const handleNavigate = () => {
    navigate('/new-machine'); 
  };

  return (
    <div>
      <h1>Bem-vindo ao Dashboard, {username}!</h1>
      <button onClick={handleLogout}>Logout</button> 
      {isLoading && <p>Carregando máquinas...</p>}
      {error && <p style={{ color: 'red' }}>Erro ao carregar as máquinas: {error}</p>}

      <div className="machine-cards">
        {machines.length > 0 ? (
          machines.map((machine) => (
            <div key={machine.id} className="machine-card">
              <h2>{machine.name}</h2>
              <p>Tipo: {machine.type}</p>
            </div>
          ))
        ) : (
          <p>Você não tem máquinas disponíveis.</p>
        )}
      </div>
      <button onClick={ handleNavigate }>Nova máquina</button>
    </div>
  );
}

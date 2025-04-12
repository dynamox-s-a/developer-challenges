import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { deleteMachine, fetchMachines } from '../redux/actions';
import { RootState, AppDispatch } from '../redux/store'; 
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); 
  const userId = useSelector((state: RootState) => state.id);
  const username = useSelector((state: RootState) => state.user); 
  const isLoading = useSelector((state: RootState) => state.isLoading); 
  const error = useSelector((state: RootState) => state.error);
  const machines = useSelector((state: RootState) => state.machines);

  useEffect(() => {
    console.log('userId:', userId);
    if (userId !== null) {
      dispatch(fetchMachines(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const handleNavigate = () => {
    navigate('/new-machine'); 
  };

  const handleDelete = (machineId: string | undefined) => {
    if (machineId !== undefined) {
      dispatch(deleteMachine(machineId));
    }
  }

  return (
    <div>
      <h1>Bem-vindo ao Dashboard, {username}!</h1>
      <button onClick={handleLogout}>Logout</button> 
      {isLoading && <p>Carregando máquinas...</p>}
      {error && <p style={{ color: 'red' }}>Erro ao carregar as máquinas: {error}</p>}

      <div className="machine-cards">
        {machines ? (
          machines.map((machine) => (
            <div key={machine.id} className="machine-card">
              <h2>{machine.name}</h2>
              <p>Tipo: {machine.type}</p>
              <button onClick={ () => handleDelete(machine.id) }>Excluir</button>
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

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteMachine, getMachines } from '../redux/actions/machineActions';
import { RootState, AppDispatch } from '../redux/store'; 
import Form from '../components/Form';
import { getMonitoringPoints } from '../redux/actions/monitoringActions';
import SensorForm from '../components/SensorForm';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>(); 
  const userId = useSelector((state: RootState) => state.id);
  const username = useSelector((state: RootState) => state.user); 
  const isLoading = useSelector((state: RootState) => state.isLoading); 
  const error = useSelector((state: RootState) => state.error);
  const machines = useSelector((state: RootState) => state.machines);
  const monitoringPoints = useSelector((state: RootState) => state.monitoringPoints);
  const [showForm, setShowForm] = useState(false);
  const [editingMachineId, setEditingMachineId] = useState<string | null>(null);
  const [activeSensorForm, setActiveSensorForm] = useState<string | null>(null);

  useEffect(() => {
    console.log('userId:', userId);
    console.log('machines:', machines);
    if (userId !== null) {
      dispatch(getMachines(userId));
    }
    if (machines !== null) {
      dispatch(getMonitoringPoints(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
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
              <button onClick={() => setEditingMachineId(machine.id!)}>Editar</button>
              {editingMachineId === machine.id && (
                  <Form
                    isEdit={true}
                    machineId={machine.id}
                    onFinish={() => setEditingMachineId(null)}
                  />
              )}
              {monitoringPoints.length > 0 && (
  monitoringPoints.find((point) => point.machineId === machine.id) && (
    <div>
      <h3>Pontos de Monitoramento:</h3>
      {monitoringPoints
        .filter((point) => point.machineId === machine.id)
        .map((point) => (
          <div key={point.id} style={{ marginBottom: '10px' }}>
            <p>{point.name}</p>
            {activeSensorForm === point.id ? (
              <SensorForm
                monitoringPointId={point.id}
                onClose={() => setActiveSensorForm(null)}
              />
            ) : (
              <button onClick={() => setActiveSensorForm(point.id!)}>Adicionar Sensor</button>
            )}
          </div>
        ))}
    </div>
  )
)}
            </div>
          ))
        ) : (
          <p>Você não tem máquinas disponíveis.</p>
        )}
      </div>
      <button onClick={() => setShowForm(true)}>Nova máquina</button>
      {showForm && (
                <div>
                  <Form isEdit={false} onFinish={() => setShowForm(false)}/>
                </div>
      )}
    </div>
  );
}

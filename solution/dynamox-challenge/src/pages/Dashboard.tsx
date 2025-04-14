import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteMachine, getMachines } from '../redux/actions/machineActions';
import { RootState, AppDispatch } from '../redux/store';
import Form from '../components/Form';
import { getMonitoringPoints, getSensors } from '../redux/actions/monitoringActions';
import SensorForm from '../components/SensorForm';
import { Sensor } from '../types';

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
  const sensors = useSelector((state: RootState) => state.sensors);

  useEffect(() => {
    if (userId !== null) {
      dispatch(getMachines(userId));
      dispatch(getMonitoringPoints(userId));
      dispatch(getSensors())
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const handleDelete = (machineId: string | undefined) => {
    if (machineId !== undefined) {
      dispatch(deleteMachine(machineId));
    }
  };


  const handleCancelEditMachine = () => {
    setEditingMachineId(null);
  };

  const handleCancelSensorForm = () => {
    setActiveSensorForm(null);
  };

  const getSensor = (monitoringPointId: string): Sensor[] | null => {
    const sensor = sensors.filter((sensor) => sensor.monitoringPointId === monitoringPointId);
    return sensor ? sensor : null;
  }

  return (
    <div>
      <h1>Bem-vindo ao Dashboard, {username}!</h1>
      <button onClick={handleLogout}>Logout</button>
      {isLoading && <p>Carregando máquinas...</p>}
      {error && <p style={{ color: 'red' }}>Erro ao carregar as máquinas: {error}</p>}

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>Ponto de Monitoramento</th>
            <th>Máquina</th>
            <th>Tipo</th>
            <th>Sensor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {machines ? (
            machines.map((machine) =>
              monitoringPoints
                .filter((point) => point.machineId === machine.id)
                .map((point) => {
                  return (
                    <tr key={point.id}>
                      <td>{point.name}</td>
                      <td>{machine.name}</td>
                      <td>{machine.type}</td>
                      <td>
                        {
                        getSensor(point.id!) !== null ? (
                          getSensor(point.id!)?.map((sensor: Sensor, index: number, array) => (
                            <div key={sensor.id}>
                              {sensor.model}
                              {index < array.length - 1 && ', '}
                            </div>
                          ))
                        ) : (
                          'Nenhum sensor vinculado'
                        )}
                      </td>
                      <td>
                        {activeSensorForm === point.id ? (
                          <>
                            <SensorForm
                              monitoringPointId={point.id}
                              onClose={handleCancelSensorForm}
                            />
                            <button onClick={handleCancelSensorForm}>Cancelar</button>
                          </>
                        ) : (
                          <button onClick={() => setActiveSensorForm(point.id!)}>Adicionar Sensor</button>
                        )}
                      </td>
                    </tr>
                  );
                })
            )
          ) : (
            <tr>
              <td colSpan={5}>Você não tem máquinas disponíveis.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Formulário para editar ou adicionar nova máquina */}
      {showForm && (
        <div>
          <Form isEdit={false} onFinish={() => setShowForm(false)} />
        </div>
      )}
      <div className="machine-info">
        {machines && machines.map((machine) => (
          <div key={machine.id} className="machine-card">
            <h2>{machine.name}</h2>
            <p>Tipo: {machine.type}</p>
            <button onClick={() => handleDelete(machine.id)}>Excluir Máquina</button>
            <button onClick={() => setEditingMachineId(machine.id!)}>Editar</button>
          </div>
        ))}
      </div>
      {editingMachineId ? (
        <>
          <Form
            isEdit={true}
            machineId={editingMachineId}
            onFinish={handleCancelEditMachine}
          />
          <button onClick={handleCancelEditMachine}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setShowForm(true)}>Nova máquina</button>
      )}
    </div>
  );
}

// Tela inicial com as informações sobre as máquinas e pontos de monitoramento
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { getMachines } from '../redux/actions/machineActions';
import { RootState, AppDispatch } from '../redux/store';
import Form from '../components/Form';
import { getMonitoringPoints, getSensors } from '../redux/actions/monitoringActions';
import SensorForm from '../components/SensorForm';
import { Sensor } from '../types';
import MachineCard from '../components/MachineCard';
import TablePagination from '@mui/material/TablePagination';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.id);
  const username = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const error = useSelector((state: RootState) => state.error);
  const machines = useSelector((state: RootState) => state.machines);
  const monitoringPoints = useSelector((state: RootState) => state.monitoringPoints);
  const [showForm, setShowForm] = useState(false);
  const [activeSensorForm, setActiveSensorForm] = useState<string | null>(null);
  const sensors = useSelector((state: RootState) => state.sensors);
  const [page, setPage] = useState(0);

  // Definindo o número de linhas por página
  const rowsPerPage = 5;

  // Função que muda de página
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

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

  const handleCancelSensorForm = () => {
    setActiveSensorForm(null);
  };

  const getSensor = (monitoringPointId: string): Sensor[] | null => {
    const sensor = sensors.filter((sensor) => sensor.monitoringPointId === monitoringPointId);
    return sensor ? sensor : null;
  }

    // Gerando os dados já com mapeamento direto
    const tableData = useMemo(() => {
      if (!machines || machines.length === 0) return [];
    
      return machines.flatMap((machine) =>
        monitoringPoints
          .filter((point) => point.machineId === machine.id)
          .map((point) => ({
            id: point.id,
            monitoringPointName: point.name,
            machineName: machine.name,
            machineType: machine.type,
            sensors: getSensor(point.id!) || [],
          }))
      );
    }, [machines, monitoringPoints, sensors]);
  
    // Slice para exibir apenas os itens da página atual
    const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  

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
  {paginatedData.length > 0 ? (
    paginatedData.map((item) => (
      <tr key={item.id}>
        <td>{item.monitoringPointName}</td>
        <td>{item.machineName}</td>
        <td>{item.machineType}</td>
        <td>
          {item.sensors.length > 0 ? (
            item.sensors.map((sensor: Sensor, index: number, array) => (
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
          {activeSensorForm === item.id ? (
            <SensorForm
              monitoringPointId={item.id}
              onClose={handleCancelSensorForm}
            />
          ) : (
            <button onClick={() => setActiveSensorForm(item.id!)}>Adicionar Sensor</button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5}>Você não tem máquinas disponíveis.</td>
    </tr>
  )}
</tbody>
      </table>
      <TablePagination
  component="div"
  count={tableData.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={[]}
/>

      {/* Cards renderizando cada máquina */}
      <div className="machine-info">
        {machines && machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      {/* Formulário para adicionar nova máquina */}
      <button onClick={() => setShowForm(true)}>Nova máquina</button>
      {showForm && (
        <div>
          <Form isEdit={false} onFinish={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}

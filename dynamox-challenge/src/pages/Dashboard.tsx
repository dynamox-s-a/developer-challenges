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
import { AppBar, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

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

    // Gerando os dados já com mapeamento direto e aplicando a ordenação
    const tableData = useMemo(() => {
      if (!machines || machines.length === 0) return [];
    
      const data = machines.flatMap((machine) =>
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
    
      if (sortConfig) {
        data.sort((a, b) => {
          const aValue = a[sortConfig.key as keyof typeof a];
          const bValue = b[sortConfig.key as keyof typeof b];
    
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
    
          return 0;
        });
      }
    
      return data;
    }, [machines, monitoringPoints, sensors, sortConfig]);
  
    // Slice para exibir apenas os itens da página atual
    const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleSort = (key: string) => {
      setSortConfig((prev) => {
        if (prev?.key === key) {
          return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
      });
    };
    const columns = [
      { key: 'machineName', label: 'Machine Name' },
      { key: 'machineType', label: 'Machine Type' },
      { key: 'monitoringPointName', label: 'Monitoring Point' },
      { key: 'sensorModel', label: 'Sensor Model' },
    ];
  return (
    <div>
      <Box className="app-header" sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
      <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard By {username}
          </Typography>
          <Button className="logout-button" color="inherit" onClick={handleLogout}><LogoutIcon /></Button>
        </Toolbar>
      </AppBar>
      </Box>
      {isLoading && <p>Carregando máquinas...</p>}
      {error && <p style={{ color: 'red' }}>Erro ao carregar as máquinas: {error}</p>}

      {/* Tabela */}
      <TableContainer className="table-container" sx={{ marginTop: '60px', marginRight: '16px'}} component={ Paper }>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
  <TableRow>
    {columns.map((column) => {
      const isActive = sortConfig?.key === column.key;
      return (
        <TableCell
          key={column.key}
          onClick={() => handleSort(column.key)}
          sx={{ fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
        >
          {column.label}
          <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
            {isActive ? (
              sortConfig.direction === 'asc' ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )
            ) : (
              <ArrowDownwardIcon fontSize="small" style={{ opacity: 0.3 }} />
            )}
          </span>
        </TableCell>
      );
    })}
  </TableRow>
</TableHead>
        <TableBody>
  {paginatedData.length > 0 ? (
    paginatedData.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.monitoringPointName}</TableCell>
        <TableCell>{item.machineName}</TableCell>
        <TableCell>{item.machineType}</TableCell>
        <TableCell>
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
        </TableCell>
        <TableCell>
          {activeSensorForm === item.id ? (
            <SensorForm
              monitoringPointId={item.id}
              onClose={handleCancelSensorForm}
            />
          ) : (
            <Button onClick={() => setActiveSensorForm(item.id!)}>Add Sensor</Button>
          )}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <tr>
      <TableCell colSpan={5}>Você não tem máquinas disponíveis.</TableCell>
    </tr>
  )}
</TableBody>
</Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={tableData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
      {/* Cards renderizando cada máquina */}
      <div className="card-list">
        {machines && machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
      <Button onClick={() => setShowForm(true)} style={{ marginTop: '16px'}}>New Machine</Button>

      {/* Formulário para adicionar nova máquina */}
      {showForm && (
        <div>
          <Form isEdit={false} onFinish={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}

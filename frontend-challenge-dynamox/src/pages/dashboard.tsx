import { Box, Paper, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard//layout';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface MachineResponse {
  idMachine: string;
  name: string;
  type: string;
}

interface MonitoringPointResponse {
  idPoint: string;
  name: string;
  machineId: string;
}

interface SensorsResponse {
  idSensor: string;
  model: string;
  pointId: string;
  machineId: string;
}

interface DetailsResponse {
  id: string;
  monitoringPoint: {
    name: string;
    machine: {
      name: string;
      type: string;
    }
  }
  model: string;
}

const columnsDetails: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nome máquina', width: 120 },
  { field: 'type', headerName: 'Tipo máquina', width: 130 },
  { field: 'namePoint', headerName: 'Ponto de monitoramento', width: 130 },
  { field: 'sensorModel', headerName: 'Modelo sensor', width: 130 },
];

const columnsMachine: GridColDef[] = [
  { field: 'idMachine', headerName: 'idMachine', width: 120 },
  { field: 'name', headerName: 'Machine name', width: 150 },
  { field: 'type', headerName: 'Machine type', width: 150 },
];

const columnsMonitoringPoint: GridColDef[] = [
  { field: 'idPoint', headerName: 'idPoint', width: 120 },
  { field: 'name', headerName: 'Nome ponto de monitoramento', width: 180 },
  { field: 'machineId', headerName: 'idMachine', width: 150 },
];

const columnsSensor: GridColDef[] = [
  { field: 'idSensor', headerName: 'idSensor', width: 120 },
  { field: 'model', headerName: 'Modelo sensor', width: 150 },
  { field: 'pointId', headerName: 'idPoint', width: 150 },
  { field: 'machineId', headerName: 'idMachine', width: 150 },
];

const paginationModel = { page: 0, pageSize: 5 };

export function Dashboard() {
  const [machines, setMachines] = useState<MachineResponse[]>([]);
  const [points, setPoints] = useState<MonitoringPointResponse[]>([]);
  const [sensor, setSensor] = useState<SensorsResponse[]>([]);
  const [details, setDetails] = useState<DetailsResponse[]>([]);

  async function getMachines() {
    const response = await api.get('/machine', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
    return response.data;
  }

  async function getMonitoringPoints() {
    const response = await api.get('/monitoring-point', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
    return response.data;
  }

  async function getDetails() {
    const response = await api.get('/sensors/details', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
    console.log(response.data);

    const formattedData = response.data.map((item: DetailsResponse) => ({
      id: item.monitoringPoint.machine.name + item.model,
      name: item.monitoringPoint.machine.name,
      type: item.monitoringPoint.machine.type,
      namePoint: item.monitoringPoint.name,
      sensorModel: item.model,
    }));

    return formattedData;
  }

  async function getSensors() {
    const response = await api.get('/sensors', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
    return response.data;
  }

  useEffect(() => {
    document.title = `Dashboard | Overview`;
    getMachines().then((data) => {
      setMachines(data);
    });

    getMonitoringPoints().then((data) => {
      setPoints(data);
    });

    getSensors().then((data) => {
      setSensor(data);
    });

    getDetails().then((data) => {
      setDetails(data);
    });
  }, []);

  return (
    <DashboardLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6, gap: 2 }}>
        <Box sx={{ display: 'column', gap: 2, mb: 3, maxWidth: '50vw' }}>
          <Typography variant="h5" gutterBottom>
            Detalhes
          </Typography>
          <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={details}
              columns={columnsDetails}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
              getRowId={(row) => row.id}
            />
          </Paper>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'column', gap: 2, mb: 3, mt: 2, maxWidth: '30vw' }}>
            <Typography variant="h5" gutterBottom>
              Máquinas
            </Typography>
            <Paper sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={machines}
                columns={columnsMachine}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => row.idMachine}
              />
            </Paper>
          </Box>
          <Box sx={{ display: 'column', gap: 2, mb: 3, mt: 2, maxWidth: '30vw' }}>
            <Typography variant="h5" gutterBottom>
              Pontos de monitoramento
            </Typography>
            <Paper sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={points}
                columns={columnsMonitoringPoint}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => row.idPoint}
              />
            </Paper>
          </Box>

          <Box sx={{ display: 'column', gap: 2, mb: 3, mt: 2, maxWidth: '30vw' }}>
            <Typography variant="h5" gutterBottom>
              Sensores
            </Typography>
            <Paper sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={sensor}
                columns={columnsSensor}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => row.idSensor}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}


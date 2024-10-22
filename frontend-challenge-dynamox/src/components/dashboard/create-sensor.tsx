import { Button, Box, Alert, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardLayout } from './layout';

const columnsMachine: GridColDef[] = [
  { field: 'idMachine', headerName: 'idMachine', width: 120 },
  { field: 'name', headerName: 'Machine name', width: 150 },
  { field: 'type', headerName: 'Machine type', width: 150 },
];

const columnsPoint: GridColDef[] = [
  { field: 'idPoint', headerName: 'idPoint', width: 120 },
  { field: 'name', headerName: 'Monitoring point name', width: 150 },
  { field: 'machineId', headerName: 'Machine Id', width: 150 },
];

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

const paginationModel = { page: 0, pageSize: 5 };

export function CreateSensor(): React.JSX.Element {
  const [model, setSensormodel] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [machineSelection, setMachineSelection] = useState<GridRowSelectionModel>([]);
  const [pointSelection, setPointSelection] = useState<GridRowSelectionModel>([]);
  const [machines, setMachines] = useState<MachineResponse[]>([]);
  const [points, setPoints] = useState<MonitoringPointResponse[]>([]);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMachines().then((data) => {
      setMachines(data);
    });

    getMonitoringPoints().then((data) => {
      setPoints(data);
    });
  }, []);

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

  async function createSensor(model: string, machineId: string | undefined, pointId: string | undefined) {
    const response = await api.post(`/sensors/${machineId}/${pointId}`, { model },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      }
    );

    return response.data;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const selectedMachine = machines.find((row) => row.idMachine === machineSelection[0]);
    const selectedPoint = points.find((row) => row.idPoint === pointSelection[0]);

    if (selectedMachine && selectedMachine.type === 'Pump' && (model === 'TcAg' || model === 'TcAs')) {
      setValidationError('Não é permitido configurar os sensores TcAg e TcAs para máquinas do tipo Pump.');
      return;
    }

    createSensor(model, selectedMachine?.idMachine, selectedPoint?.idPoint).then(() => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/dashboard/overview');
      }, 2000);
    });
  };

  const handleMachineSelection = (selection: GridRowSelectionModel) => {
    setMachineSelection(selection); 
  }

  const handlePointSelection = (selection: GridRowSelectionModel) => {
    setPointSelection(selection); 
  };

  return (
    <DashboardLayout>
      <Box sx={{ 
        display: { xs: 'flex', lg: 'grid' },
        maxWidth: 700, 
        margin: '0 auto',
        marginTop: '15vw',
        textAlign: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Typography variant="h4" gutterBottom>
          Adicionar sensor
        </Typography>
        
        {showAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Sensor alocado com sucesso!
          </Alert>
        )}

        {validationError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {validationError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="sensor-model-label">Modelo do sensor</InputLabel>
              <Select
                labelId="sensor-model-label"
                value={model}
                label="Modelo do sensor"
                onChange={(e) => setSensormodel(e.target.value)}
                required
              >
                <MenuItem value="TcAg">TcAg</MenuItem>
                <MenuItem value="TcAs">TcAs</MenuItem>
                <MenuItem value="HFPlus">HFPlus</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={machineSelection.length === 0 || pointSelection.length === 0}
          >
            Adicionar sensor
          </Button>
        </form> 

        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 4 }}>

          <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={machines}
              columns={columnsMachine}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              onRowSelectionModelChange={handleMachineSelection}
              sx={{ border: 0 }}
              getRowId={(row) => row.idMachine} 
            />
          </Paper>

          <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={points}
              columns={columnsPoint}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              onRowSelectionModelChange={handlePointSelection}
              sx={{ border: 0 }}
              getRowId={(row) => row.idPoint} 
            />
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>);
}

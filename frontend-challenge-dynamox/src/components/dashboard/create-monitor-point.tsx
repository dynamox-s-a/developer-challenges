import { Button, TextField, Box, Alert, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardLayout } from './layout';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface MachineResponse {
  idMachine: string;
  name: string;
  type: string;
}

const columnsMachine: GridColDef[] = [
  { field: 'idMachine', headerName: 'idMachine', width: 120 },
  { field: 'name', headerName: 'Machine name', width: 150 },
  { field: 'type', headerName: 'Machine type', width: 150 },
];

const paginationModel = { page: 0, pageSize: 5 };

export function CreateMonitoringPoint(): React.JSX.Element {
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [machines, setMachines] = useState<MachineResponse[]>([]);
  const [machineSelection, setMachineSelection] = useState<GridRowSelectionModel>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMachines().then((data) => {
      setMachines(data);
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

  async function createMonitorinPoint(name: string, machineId: string | undefined) {
    
    const response = await api.post('/monitoring-point/'+ machineId, { name },
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
    const response = createMonitorinPoint(name, selectedMachine?.idMachine);

    console.log(response);

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate('/dashboard/overview');
    }, 2000);
  };

  const handleMachineSelection = (selection: GridRowSelectionModel) => {
    setMachineSelection(selection); 
  }

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
          Criar ponto de monitoramento
        </Typography>
        
        {showAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Ponto de monitoramento criado com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name monitoring point"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={machineSelection.length === 0}
          >
            Criar ponto de monitoramento
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
        </Box>
      </Box>
    </DashboardLayout>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { fetchMonitoringPoints, addMonitoringPoint } from '../../store/monitoringPointsSlice';
import { fetchMachines } from '../../store/machinesSlice';
import { 
  Container, Typography, Box, Button, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, MenuItem, Alert, Chip, LinearProgress
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams, GridLoadingOverlay } from '@mui/x-data-grid'; 
import AddIcon from '@mui/icons-material/Add';

export const Sensors = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { list: sensors, status: sensorStatus } = useSelector((state: RootState) => state.monitoringPoints);
  const { list: machines } = useSelector((state: RootState) => state.machines);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [sensorModel, setSensorModel] = useState('');

  useEffect(() => {
    if (sensorStatus === 'idle') dispatch(fetchMonitoringPoints());
    if (machines.length === 0) dispatch(fetchMachines());
  }, [dispatch, sensorStatus, machines.length]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome do Ponto', flex: 1, minWidth: 200 },
    { 
      field: 'machineId', 
      headerName: 'Máquina Associada', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => {
        const machine = machines.find(m => m.id === row.machineId);
        return machine ? `${machine.name} (${machine.type})` : 'Desconhecida';
      }
    },
    { 
      field: 'sensorModel', 
      headerName: 'Modelo', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={params.value === 'HF+' ? 'primary' : 'default'} 
          variant="outlined" 
          size="small"
        />
      )
    },
  ];

  const selectedMachine = machines.find(m => m.id === selectedMachineId);
  const isPump = selectedMachine?.type === 'Pump';

  const handleSave = () => {
    if (!name || !selectedMachineId || !sensorModel) {
      alert("Preencha todos os campos!");
      return;
    }
    if (isPump && sensorModel !== 'HF+') {
      alert("Máquinas Pump só aceitam sensor HF+!");
      return;
    }
    dispatch(addMonitoringPoint({
      name,
      machineId: selectedMachineId,
      sensorModel: sensorModel as "TcAg" | "TcAs" | "HF+"
    }));
    setOpen(false);
    setName('');
    setSelectedMachineId('');
    setSensorModel('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Pontos de Monitoramento
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Novo Ponto
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper' }}>
        <DataGrid
          rows={sensors}
          columns={columns}
          loading={sensorStatus === 'loading'}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]} 
          disableRowSelectionOnClick
          slots={{
            loadingOverlay: GridLoadingOverlay,
          }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Associar Novo Sensor</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nome do Ponto" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            <TextField
              select label="Selecione a Máquina" fullWidth value={selectedMachineId}
              onChange={(e) => { setSelectedMachineId(e.target.value); setSensorModel(''); }}
            >
              {machines.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>{machine.name} ({machine.type})</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Modelo do Sensor" fullWidth value={sensorModel}
              onChange={(e) => setSensorModel(e.target.value)} disabled={!selectedMachineId}
              helperText={isPump ? "Máquinas Pump aceitam apenas HF+" : "Selecione o modelo adequado"}
            >
              <MenuItem value="HF+">HF+</MenuItem>
              <MenuItem value="TcAg" disabled={isPump}>TcAg {isPump && "(Restrito)"}</MenuItem>
              <MenuItem value="TcAs" disabled={isPump}>TcAs {isPump && "(Restrito)"}</MenuItem>
            </TextField>
            {isPump && <Alert severity="warning">Máquinas <strong>Pump</strong> só aceitam HF+.</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
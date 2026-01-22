import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllMachines } from '../features/machines/machineSlice';
import { createMonitoringPoint } from '../features/monitoringPoints/monitoringPointSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Button, TextField, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { clearError } from '../features/monitoringPoints/monitoringPointSlice';

const MachinesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.machines);
  const { createError } = useAppSelector((state) => state.monitoringPoints);
  const [newPointNames, setNewPointNames] = useState<{[key: number]: string}>({});

  useEffect(() => {
    dispatch(fetchAllMachines());
  }, [dispatch]);

  const handleAddPoint = (machineId: number) => {
    const name = newPointNames[machineId];
    if (name) {
      dispatch(createMonitoringPoint({ machineId, name }));
      setNewPointNames({ ...newPointNames, [machineId]: '' });
    }
  };

  const handleCloseError = () => { dispatch(clearError()); };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Gestão de Ativos</Typography>
      {items.map((machine) => (
        <Accordion key={machine.id} sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }} elevation={1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>{machine.name}</Typography>
              <Chip 
                label={machine.type} 
                size="small" 
                color={machine.type === 'Pump' ? 'success' : 'primary'} 
                variant="outlined" 
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid #eee' }}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>Cadastrar Novo Ponto</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  size="small"
                  placeholder="Ex: Mancal Lado Acoplado"
                  value={newPointNames[machine.id] || ''}
                  onChange={(e) => setNewPointNames({ ...newPointNames, [machine.id]: e.target.value })}
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleAddPoint(machine.id)}
                  disabled={!newPointNames[machine.id]}
                >
                  Adicionar Ponto
                </Button>
              </Stack>
            </Box>
            <Dialog open={!!createError} onClose={handleCloseError}>
            <DialogTitle>Atenção</DialogTitle>
            <DialogContent>
              <Typography>Limite de 2 pontos de monitoramento atingidos.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseError} autoFocus>Entendi</Button>
            </DialogActions>
          </Dialog>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MachinesPage;
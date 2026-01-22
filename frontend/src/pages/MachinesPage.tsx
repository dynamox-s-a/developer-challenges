import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllMachines, deleteMachine, updateMachine } from '../features/machines/machineSlice';
import { createMonitoringPoint } from '../features/monitoringPoints/monitoringPointSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Button, TextField, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { clearError } from '../features/monitoringPoints/monitoringPointSlice';

const MachinesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.machines);
  const { createError } = useAppSelector((state) => state.monitoringPoints);

  const [newPointNames, setNewPointNames] = useState<{[key: number]: string}>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editMachine, setEditMachine] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');

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

  const handleDelete = async () => {
  if (confirmDelete) {
    await dispatch(deleteMachine(confirmDelete));
    setConfirmDelete(null);
  }
  };

  const handleOpenEdit = (machine: any) => {
    setEditMachine(machine);
    setEditName(machine.name);
    setEditType(machine.type);
  };

  const handleSaveEdit = async () => {
    if (editMachine) {
      await dispatch(updateMachine({ id: editMachine.id, name: editName, type: editType }));
      setEditMachine(null);
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
              <IconButton 
                size="small" 
                color="error" 
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(machine.id); }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(machine); }}
                >
                  <EditIcon fontSize="small" />
              </IconButton>
          </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid #eee' }}>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ mb: 2 }}>
              <Typography variant="overline" color="textSecondary">Pontos Associados</Typography>
              {machine.monitoring_points?.map((p: any) => (
                <Typography key={p.id} variant="body2" sx={{ ml: 1 }}>
                  • {p.name} {p.sensor ? `(${p.sensor.model})` : '(Sem sensor)'}
                </Typography>
              ))}
            </Box>
            {(machine.monitoring_points?.length ?? 0) < 2 ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>Cadastrar Novo Ponto</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  size="small"
                  placeholder="Nome do Ponto"
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
          ) : (
            <Typography variant="caption" color="warning.main">
              Limite de pontos atingido para esta máquina.
            </Typography>
          )}
            <Dialog open={!!createError} onClose={handleCloseError}>
            <DialogTitle>Atenção</DialogTitle>
            <DialogContent>
              <Typography>Limite de 2 pontos de monitoramento atingidos.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseError} autoFocus>Entendi</Button>
            </DialogActions>
          </Dialog>
          </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Excluir Máquina?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Esta ação é permanente e removerá todos os pontos de monitoramento associados a este ativo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
          >
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(editMachine)} onClose={() => setEditMachine(null)} fullWidth maxWidth="xs">
      <DialogTitle>Editar Máquina</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" fullWidth value={editName} onChange={(e) => setEditName(e.target.value)} />
          <TextField select label="Tipo" fullWidth value={editType} onChange={(e) => setEditType(e.target.value)}>
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditMachine(null)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveEdit}>Salvar</Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default MachinesPage;
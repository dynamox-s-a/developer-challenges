import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllMachines, deleteMachine, updateMachine } from '../features/machines/machineSlice';
import { createMonitoringPoint } from '../features/monitoringPoints/monitoringPointSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Button, TextField, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, MenuItem, Snackbar, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { clearError } from '../features/monitoringPoints/monitoringPointSlice';
import { SensorModal } from './SensorModal';

const MachinesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.machines);
  const { createError } = useAppSelector((state) => state.monitoringPoints);

  const [newPointNames, setNewPointNames] = useState<{[key: number]: string}>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editMachine, setEditMachine] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' }>({ open: false, message: '' });
  const [canChangeType, setCanChangeType] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(fetchAllMachines());
  }, [dispatch]);

  const handleAddPoint = async (machineId: number) => {
    const name = newPointNames[machineId]?.trim();

    if (!name) {
      setSnackbar({ 
        open: true, 
        message: 'Nome do ponto não pode ser vazio',
        severity: 'error'
      });
      return;
    }

    if (name.length < 3 || name.length > 50) {
      setSnackbar({ 
        open: true, 
        message: 'Nome deve ter entre 3 e 50 caracteres',
        severity: 'error'
      });
      return;
    }
    try {
        await dispatch(createMonitoringPoint({ machineId, name })).unwrap();
        await dispatch(fetchAllMachines()).unwrap();
        
        setSnackbar({ 
          open: true, 
          message: 'Ponto de monitoramento criado com sucesso!',
          severity: 'success'
        });
        
        setNewPointNames({ ...newPointNames, [machineId]: '' });
      } catch (error: any) {}
  };

  const handleDelete = async () => {
  if (confirmDelete) {
    await dispatch(deleteMachine(confirmDelete));
    setConfirmDelete(null);
  }
  };

  const handleOpenEdit = (machine: any) => {
    const hasRestrictedSensors = machine.monitoring_points?.some((point: any) =>
    point.sensor && ['TcAg', 'TcAs'].includes(point.sensor.model)
    );

    setEditMachine(machine);
    setEditName(machine.name);
    setEditType(machine.type);

    setCanChangeType(!hasRestrictedSensors);
  };

const handleSaveEdit = async () => {
  if (!editMachine) return;

  try {
    await dispatch(updateMachine({ 
      id: editMachine.id, 
      name: editName.trim(), 
      type: editType 
    })).unwrap();
    
    await dispatch(fetchAllMachines()).unwrap();
    
    setEditMachine(null);
    setSnackbar({ 
      open: true, 
      message: 'Máquina atualizada com sucesso!',
      severity: 'success'
    });
  } catch (error: any) {
    setSnackbar({ 
      open: true, 
      message: error || 'Erro ao atualizar máquina',
      severity: 'error'
    });
  }
};

  const handleCloseError = () => { dispatch(clearError()); };
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
  const handleCloseSensorModal = () => {
    setSelectedPoint(null);
    dispatch(fetchAllMachines());
  };

  const handleAccordionChange = (machineId: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(machineId);
      } else {
        newSet.delete(machineId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Gestão de Ativos</Typography>
      {items.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            px: 3,
            bgcolor: '#fafafa',
            borderRadius: 2,
            border: '2px dashed #e0e0e0'
          }}
        >
          <PrecisionManufacturingIcon sx={{ fontSize: 64, color: '#692746', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma máquina cadastrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comece criando sua primeira máquina através do botão <strong>"Nova Máquina"</strong> no topo da página.
          </Typography>
        </Box>
      ) : (
        items.map((machine) => (
        <Accordion 
          key={machine.id} 
          expanded={expandedAccordions.has(machine.id)}
          onChange={handleAccordionChange(machine.id)}
          sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }} 
          elevation={1}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>{machine.name}</Typography>
              <Chip 
                label={machine.type} 
                size="small" 
                color={machine.type === 'Pump' ? 'default' : 'primary'} 
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
                <Stack key={p.id} direction="row" spacing={1} alignItems="center" sx={{ ml: 1, mb: 0.5 }}>
                  <Typography variant="body2">
                    • {p.name} {p.sensor ? `(${p.sensor.model})` : '(Sem sensor)'}
                  </Typography>
                  {!p.sensor && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SettingsInputComponentIcon />}
                      onClick={() => setSelectedPoint({ point_id: p.id, point_name: p.name, machine_type: machine.type, machine_name: machine.name })}
                      sx={{ 
                        fontSize: '0.75rem', 
                        py: 0.25, 
                        px: 1,
                        borderColor: '#7a2f54',
                        color: '#7a2f54',
                        '&:hover': {
                          borderColor: '#8a3f64',
                          bgcolor: 'rgba(122, 47, 84, 0.04)'
                        }
                      }}
                    >
                      Associar Sensor
                    </Button>
                  )}
                </Stack>
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
            <Typography variant="caption" color="error">
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
      ))
      )}
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
          <TextField select label="Tipo" fullWidth value={editType} onChange={(e) => setEditType(e.target.value)} disabled={!canChangeType} helperText={!canChangeType ? "Não é possível alterar o tipo pois há sensores TcAg/TcAs associados" : ""}>
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
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={4000} 
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'success'} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    <SensorModal 
      open={Boolean(selectedPoint)} 
      onClose={handleCloseSensorModal} 
      point={selectedPoint} 
    />
    </Box>
  );
};

export default MachinesPage;
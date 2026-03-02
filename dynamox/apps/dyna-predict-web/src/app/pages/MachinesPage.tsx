import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteMachine, fetchMachines } from '../../store/features/machines/machine.slice';
import type { MachinesListResponse } from '@dynamox/types';
import MachineFormDialog from '../../components/MachineFormDialog';
import MachineMonitoringPointsModal from '../../components/MachineMonitoringPointsModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../utils/useConfirmDialog';
import { notify } from '../../utils/notifications';

type Machine = MachinesListResponse['machines'][number];

function MachinesPage() {
  const dispatch = useAppDispatch();
  const { machines, isLoading } = useAppSelector((state) => state.machines);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>();
  const [pointsModalMachine, setPointsModalMachine] = useState<Machine | undefined>();
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const rows = machines;

  const handleAdd = () => {
    setSelectedMachine(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (machine: Machine) => {
    setSelectedMachine(machine);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedMachine(undefined);
  };

  const handleDelete = async (machine: Machine) => {
    const confirmed = await confirm({
      title: 'Excluir máquina?',
      description: `Isso irá remover "${machine.name}" permanentemente.`,
      severity: 'error',
      confirmLabel: 'Excluir',
    });

    if (confirmed) {
      try {
        await dispatch(deleteMachine(machine.uuid)).unwrap();
        notify(`Máquina "${machine.name}" removida com sucesso.`, 'success');
      } catch {
        notify('Erro ao remover máquina. Tente novamente.', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Máquinas
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={handleAdd}>
          Adicionar Máquina
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="center">Pontos de Monitoramento</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={60} /></TableCell>
                    <TableCell align="center"><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton width={80} /></TableCell>
                  </TableRow>
                ))
              : rows.map((machine) => (
                  <TableRow key={machine.uuid} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{machine.name}</TableCell>
                    <TableCell>
                      <Chip label={machine.type} size="small" variant="filled" />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title={`${machine.unassignedSensorCount} ponto(s) sem sensor`}>
                          <WarningAmberIcon
                            fontSize="small"
                            color="warning"
                            sx={{ visibility: machine.unassignedSensorCount > 0 ? 'visible' : 'hidden' }}
                          />
                        </Tooltip>
                        <Chip label={machine.monitoringPoints.length} size="small" variant="outlined" />
                        <IconButton
                          size="small"
                          onClick={() => setPointsModalMachine(machine)}
                          disabled={machine.monitoringPoints.length === 0}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ mr: 0.5 }} onClick={() => handleEdit(machine)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(machine)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MachineFormDialog open={dialogOpen} onClose={handleClose} machine={selectedMachine} />
      <MachineMonitoringPointsModal
        open={!!pointsModalMachine}
        onClose={() => setPointsModalMachine(undefined)}
        machine={pointsModalMachine}
      />
      <ConfirmDialog {...dialogProps} />
    </Box>
  );
}

export default MachinesPage;

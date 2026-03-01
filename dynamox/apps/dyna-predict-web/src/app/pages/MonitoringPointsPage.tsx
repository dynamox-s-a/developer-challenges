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
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteMonitoringPoint,
  fetchMonitoringPoints,
} from '../../store/features/monitoring-points/monitoring-points.slice';
import type { MonitoringPointSortBy } from '../../store/features/monitoring-points/monitoring-points.slice';
import type { MonitoringPointWithMachineAndSensor } from '@dynamox/types';
import MonitoringPointFormDialog from '../../components/MonitoringPointFormDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../utils/useConfirmDialog';
import { notify } from '../../utils/notifications';

const PAGE_SIZE = 5;

type SortOrder = 'asc' | 'desc';

const COLUMNS: { id: MonitoringPointSortBy; label: string }[] = [
  { id: 'machineName', label: 'Máquina' },
  { id: 'machineType', label: 'Tipo' },
  { id: 'name', label: 'Ponto de Monitoramento' },
  { id: 'sensorModel', label: 'Sensor' },
];

function MonitoringPointsPage() {
  const dispatch = useAppDispatch();
  const { monitoringPoints, pagination, isLoading } = useAppSelector(
    (state) => state.monitoringPoints
  );

  const [page, setPage] = useState(0); // 0-based (MUI)
  const [sortBy, setSortBy] = useState<MonitoringPointSortBy>('machineName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<
    MonitoringPointWithMachineAndSensor | undefined
  >();
  const { confirm, dialogProps } = useConfirmDialog();

  const fetchParams = { page: page + 1, pageSize: PAGE_SIZE, sortBy, sortOrder };

  useEffect(() => {
    dispatch(fetchMonitoringPoints(fetchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, sortBy, sortOrder]);

  const handleSort = (column: MonitoringPointSortBy) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleAdd = () => {
    setSelectedPoint(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (point: MonitoringPointWithMachineAndSensor) => {
    setSelectedPoint(point);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedPoint(undefined);
  };

  const handleDelete = async (point: MonitoringPointWithMachineAndSensor) => {
    const confirmed = await confirm({
      title: 'Excluir ponto de monitoramento?',
      description: `Isso irá remover "${point.name}" permanentemente, incluindo o sensor e séries temporais associados.`,
      severity: 'error',
      confirmLabel: 'Excluir',
    });

    if (confirmed) {
      try {
        await dispatch(deleteMonitoringPoint(point.uuid)).unwrap();
        dispatch(fetchMonitoringPoints(fetchParams));
        notify(`Ponto "${point.name}" removido com sucesso.`, 'success');
      } catch {
        notify('Erro ao remover ponto de monitoramento. Tente novamente.', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Pontos de Monitoramento
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={handleAdd}>
          Adicionar Ponto
        </Button>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col.id}>
                  <TableSortLabel
                    active={sortBy === col.id}
                    direction={sortBy === col.id ? sortOrder : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.id}>
                        <Skeleton />
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Skeleton width={80} />
                    </TableCell>
                  </TableRow>
                ))
              : monitoringPoints.map((point) => (
                  <TableRow key={point.uuid} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{point.machine.name}</TableCell>
                    <TableCell>
                      <Chip label={point.machine.type} size="small" variant="filled" />
                    </TableCell>
                    <TableCell>{point.name}</TableCell>
                    <TableCell>
                      {point.sensor?.model ? (
                        <Chip label={point.sensor.model} size="small" variant="outlined" />
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ mr: 0.5 }} onClick={() => handleEdit(point)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(point)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={pagination?.totalElements ?? 0}
                page={page}
                rowsPerPage={PAGE_SIZE}
                rowsPerPageOptions={[PAGE_SIZE]}
                onPageChange={handlePageChange}
                colSpan={COLUMNS.length + 1}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <MonitoringPointFormDialog
        open={dialogOpen}
        onClose={handleClose}
        point={selectedPoint}
        fetchParams={fetchParams}
      />
      <ConfirmDialog {...dialogProps} />
    </Box>
  );
}

export default MonitoringPointsPage;

import {
  locationLabel,
  type CreateMachineRequest,
  type Location,
  type MachineType,
  type MonitoringPoint,
} from '@condition-monitor/shared';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { MachineFormDialog } from '../machines/machine-form-dialog';
import { deleteMachine, fetchNextNumber, updateMachine } from '../machines/machines-slice';
import { fetchSectors } from '../sectors/sectors-slice';
import { AddPositionsDialog } from './add-positions-dialog';
import {
  addPositions,
  deletePoint,
  fetchMachineDetail,
  installSensor,
  removeSensor,
  updatePoint,
} from './machine-detail-slice';
import { PointDialog } from './point-dialog';
import { SensorDialog } from './sensor-dialog';

type Dialog =
  | { kind: 'editMachine' }
  | { kind: 'deleteMachine' }
  | { kind: 'addPositions' }
  | { kind: 'editPoint'; point: MonitoringPoint }
  | { kind: 'deletePoint'; point: MonitoringPoint }
  | { kind: 'sensor'; point: MonitoringPoint }
  | { kind: 'removeSensor'; point: MonitoringPoint };

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/**
 * One machine: its monitoring points in power-flow order, the sensor of each, and every
 * change to them (assumptions B1, B3, B11 to B15).
 */
export function MachineDetailPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail, status, error } = useAppSelector((state) => state.machineDetail);
  const sectors = useAppSelector((state) => state.sectors.items);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const close = () => setDialog(null);

  useEffect(() => {
    void dispatch(fetchMachineDetail(id));
    void dispatch(fetchSectors());
  }, [dispatch, id]);

  const suggestNumber = useCallback(
    async (sectorId: string, type: MachineType) => {
      const action = await dispatch(fetchNextNumber({ sectorId, type }));
      return fetchNextNumber.fulfilled.match(action) ? action.payload.number : null;
    },
    [dispatch],
  );

  if (status === 'failed' && !detail) {
    return <RetryAlert message={error} onRetry={() => void dispatch(fetchMachineDetail(id))} />;
  }
  if (!detail || detail.id !== id) {
    return <LoadingIndicator label="Loading machine" />;
  }

  const machineId = detail.id;
  const taken = detail.monitoringPoints
    .map((point) => point.location)
    .filter((location): location is Location => location !== 'OTHER');
  const selected = dialog && 'point' in dialog ? dialog.point : null;

  const saveMachine = async (values: CreateMachineRequest) => {
    const action = await dispatch(updateMachine({ id: machineId, changes: values }));
    if (updateMachine.fulfilled.match(action)) {
      void dispatch(fetchMachineDetail(machineId));
      return null;
    }
    return action.payload ?? null;
  };

  const removeMachine = async () => {
    const action = await dispatch(deleteMachine(machineId));
    if (!deleteMachine.fulfilled.match(action)) return action.payload?.message ?? 'Not deleted.';
    navigate('/machines', { replace: true });
    return null;
  };

  return (
    <>
      <Breadcrumbs sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/machines" underline="hover" color="inherit">
          Machines
        </Link>
        <Typography color="text.primary">{detail.tag}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h1">
            {detail.tag}
          </Typography>
          <Typography color="text.secondary">
            {detail.name} · {detail.sector.name}
          </Typography>
        </Box>
        <Chip label={detail.type} />
        <Button startIcon={<EditIcon />} onClick={() => setDialog({ kind: 'editMachine' })}>
          Edit
        </Button>
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDialog({ kind: 'deleteMachine' })}
        >
          Delete
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          Monitoring points
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ kind: 'addPositions' })}
        >
          Add positions
        </Button>
      </Box>
      {detail.monitoringPoints.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            No monitoring points yet. Add the positions where sensors are mounted.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Monitoring points of the machine">
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Sensor</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.monitoringPoints.map((point) => (
                <TableRow key={point.id} hover>
                  <TableCell>{locationLabel(point.location)}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/monitoring-points/${point.id}`}>
                      {point.name}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {point.sensor ? (
                      <>
                        {point.sensor.serialNumber} <Chip size="small" label={point.sensor.model} />
                      </>
                    ) : (
                      <Typography component="span" color="text.secondary">
                        No sensor
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title={point.sensor ? 'Replace sensor' : 'Install sensor'}>
                      <IconButton
                        aria-label={`${point.sensor ? 'Replace' : 'Install'} sensor at ${point.name}`}
                        onClick={() => setDialog({ kind: 'sensor', point })}
                      >
                        <SensorsIcon />
                      </IconButton>
                    </Tooltip>
                    {point.sensor && (
                      <Tooltip title="Remove sensor">
                        <IconButton
                          aria-label={`Remove sensor at ${point.name}`}
                          onClick={() => setDialog({ kind: 'removeSensor', point })}
                        >
                          <SensorsOffIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <IconButton
                      aria-label={`Edit point ${point.name}`}
                      onClick={() => setDialog({ kind: 'editPoint', point })}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete point ${point.name}`}
                      onClick={() => setDialog({ kind: 'deletePoint', point })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MachineFormDialog
        open={dialog?.kind === 'editMachine'}
        machine={detail}
        sectors={sectors}
        defaultSectorId={detail.sector.id}
        suggestNumber={suggestNumber}
        onSubmit={saveMachine}
        onClose={close}
      />
      <ConfirmDialog
        open={dialog?.kind === 'deleteMachine'}
        title={`Delete machine ${detail.tag}?`}
        confirmLabel="Delete"
        onConfirm={removeMachine}
        onClose={close}
      >
        {detail.name} will be removed with{' '}
        {plural(detail.counts.monitoringPoints, 'monitoring point')} and{' '}
        {plural(detail.counts.sensors, 'sensor')}. This cannot be undone.
      </ConfirmDialog>
      <AddPositionsDialog
        open={dialog?.kind === 'addPositions'}
        machineType={detail.type}
        taken={taken}
        onSubmit={async (positions) => {
          const action = await dispatch(addPositions({ machineId, positions }));
          return addPositions.fulfilled.match(action) ? null : (action.payload ?? null);
        }}
        onClose={close}
      />
      <PointDialog
        open={dialog?.kind === 'editPoint'}
        point={selected}
        machineType={detail.type}
        taken={taken}
        onSubmit={async (changes) => {
          if (!selected) return null;
          const action = await dispatch(updatePoint({ machineId, pointId: selected.id, changes }));
          return updatePoint.fulfilled.match(action) ? null : (action.payload ?? null);
        }}
        onClose={close}
      />
      <SensorDialog
        open={dialog?.kind === 'sensor'}
        point={selected}
        machineType={detail.type}
        onSubmit={async (body) => {
          if (!selected) return null;
          const action = await dispatch(installSensor({ machineId, pointId: selected.id, body }));
          return installSensor.fulfilled.match(action) ? null : (action.payload ?? null);
        }}
        onClose={close}
      />
      <ConfirmDialog
        open={dialog?.kind === 'deletePoint'}
        title={`Delete point ${selected?.name ?? ''}?`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!selected) return null;
          const action = await dispatch(deletePoint({ machineId, pointId: selected.id }));
          return deletePoint.fulfilled.match(action)
            ? null
            : (action.payload?.message ?? 'Not deleted.');
        }}
        onClose={close}
      >
        The point will be removed
        {selected?.sensor ? ` with its sensor ${selected.sensor.serialNumber}` : ''}. This cannot be
        undone.
      </ConfirmDialog>
      <ConfirmDialog
        open={dialog?.kind === 'removeSensor'}
        title={`Remove sensor ${selected?.sensor?.serialNumber ?? ''}?`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!selected) return null;
          const action = await dispatch(removeSensor({ machineId, pointId: selected.id }));
          return removeSensor.fulfilled.match(action)
            ? null
            : (action.payload?.message ?? 'Not removed.');
        }}
        onClose={close}
      >
        The point {selected?.name} stays, ready for another sensor.
      </ConfirmDialog>
    </>
  );
}

import {
  disallowedSensorModels,
  type MachineDetailDto,
  type MonitoringPointSummaryDto,
} from '@dynapredict/shared-types';
import Add from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Edit from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { NoticeSnackbar } from '../components/NoticeSnackbar';
import { MachineFormDialog } from '../features/machines/MachineFormDialog';
import {
  deletePoint,
  fetchMachineDetail,
  removeSensor,
} from '../features/machines/machineDetailSlice';
import { PointCard } from '../features/machines/PointCard';
import { PointFormDialog } from '../features/machines/PointFormDialog';
import { SensorFormDialog } from '../features/machines/SensorFormDialog';
import {
  readingsPhrase,
  useReadingsCount,
} from '../features/readings/useReadingsCount';
import { useConfirmation } from '../hooks/useConfirmation';
import { formatDateTime, pluralize } from '../utils/format';

type Point = MonitoringPointSummaryDto;

function BackToMachines() {
  return (
    <Link
      component={RouterLink}
      to="/machines"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        minHeight: 44,
      }}
    >
      <ArrowBack fontSize="small" aria-hidden />
      Machines
    </Link>
  );
}

function sensorRuleNote(machine: MachineDetailDto): string | null {
  const disallowed = disallowedSensorModels(machine.type);
  return disallowed.length > 0
    ? `${machine.type} machines can't have ${disallowed.join(' or ')} sensors.`
    : null;
}

type ReadingsCount = ReturnType<typeof useReadingsCount>;

/** Spells out the cascade: the point, its sensor and the sensor's readings. */
function DeletePointMessage({
  point,
  readings,
}: {
  point: Point;
  readings: ReadingsCount;
}) {
  const { sensor } = point;
  let cascade = '';
  if (sensor) {
    cascade =
      readings.count === 0
        ? `, together with its sensor ${sensor.serialNumber} (no readings stored)`
        : `, together with its sensor ${sensor.serialNumber} and ${readingsPhrase(readings)}`;
  }
  return (
    <>
      <strong>{point.name}</strong> will be permanently deleted{cascade}. This
      can&apos;t be undone.
    </>
  );
}

function RemoveSensorMessage({
  point,
  readings,
}: {
  point: Point;
  readings: ReadingsCount;
}) {
  if (!point.sensor) return null;
  return (
    <>
      Sensor <strong>{point.sensor.serialNumber}</strong> ({point.sensor.model})
      will be removed from {point.name}
      {readings.count === 0
        ? '. It has no readings stored.'
        : `, and ${readingsPhrase(readings)} will be permanently deleted.`}{' '}
      This can&apos;t be undone.
    </>
  );
}

export function MachineDetailPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { machine, status, error } = useAppSelector(
    (state) => state.machineDetail,
  );

  const [editingMachine, setEditingMachine] = useState(false);
  // Dialogs keep their target after closing, so they fade out unchanged.
  const [pointForm, setPointForm] = useState<{
    open: boolean;
    point: Point | null;
  }>({ open: false, point: null });
  const [sensorForm, setSensorForm] = useState<{
    open: boolean;
    point: Point | null;
  }>({ open: false, point: null });
  const pointDeletion = useConfirmation<Point>();
  const sensorRemoval = useConfirmation<Point>();
  const [notice, setNotice] = useState<string | null>(null);

  const deletionCount = useReadingsCount(
    pointDeletion.target?.sensor?.id ?? null,
  );
  const removalCount = useReadingsCount(
    sensorRemoval.target?.sensor?.id ?? null,
  );

  useEffect(() => {
    if (id) void dispatch(fetchMachineDetail(id));
  }, [dispatch, id]);

  // The store may still hold the previous machine for a moment.
  const current = machine?.id === id ? machine : null;
  // Stable identity: the form dialog resets itself when this object changes.
  const editableMachine = useMemo(
    () =>
      current && {
        ...current,
        monitoringPointsCount: current.monitoringPoints.length,
      },
    [current],
  );

  if (!current) {
    if (status === 'failed' && error) {
      return (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <BackToMachines />
          <Typography component="h1" variant="h4">
            {error.status === 404 ? 'Machine not found' : 'Machine'}
          </Typography>
          <Alert
            severity="error"
            action={
              error.status === 404 ? undefined : (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => void dispatch(fetchMachineDetail(id))}
                >
                  Retry
                </Button>
              )
            }
          >
            {error.status === 404
              ? 'This machine does not exist or was deleted.'
              : error.message}
          </Alert>
        </Stack>
      );
    }
    return (
      <Box
        role="status"
        aria-label="Loading machine"
        sx={{ display: 'grid', placeItems: 'center', py: 8 }}
      >
        <CircularProgress aria-hidden />
      </Box>
    );
  }

  const points = current.monitoringPoints;

  const confirmPointDeletion = async () => {
    const name = pointDeletion.target?.name;
    const done = await pointDeletion.run((point) =>
      dispatch(deletePoint(point.id)).unwrap(),
    );
    if (done) setNotice(`Monitoring point "${name}" deleted.`);
  };

  const confirmSensorRemoval = async () => {
    const serial = sensorRemoval.target?.sensor?.serialNumber;
    const done = await sensorRemoval.run((point) =>
      point.sensor
        ? dispatch(removeSensor(point.sensor.id)).unwrap()
        : Promise.resolve(),
    );
    if (done) setNotice(`Sensor ${serial} removed.`);
  };
  const rule = sensorRuleNote(current);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <BackToMachines />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'flex-start' },
          }}
        >
          <div>
            <Typography
              component="h1"
              variant="h4"
              sx={{ wordBreak: 'break-word' }}
            >
              {current.name}
            </Typography>
            <Typography color="text.secondary">
              {current.type} · created {formatDateTime(current.createdAt)}
            </Typography>
          </div>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditingMachine(true)}
            sx={{ minHeight: 44, flexShrink: 0 }}
          >
            Edit machine
          </Button>
        </Stack>
      </Stack>

      <Stack component="section" aria-labelledby="points-heading" spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <div>
            <Typography id="points-heading" component="h2" variant="h5">
              Monitoring points
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pluralize(points.length, 'point')}
              {rule && ` · ${rule}`}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setPointForm({ open: true, point: null })}
            sx={{ minHeight: 44 }}
          >
            Add point
          </Button>
        </Stack>

        {points.length === 0 ? (
          <Alert severity="info">
            This machine has no monitoring points yet. Add one, then attach a
            sensor to it.
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {points.map((point) => (
              <PointCard
                key={point.id}
                point={point}
                onRename={() => setPointForm({ open: true, point })}
                onDelete={() => pointDeletion.open(point)}
                onAddSensor={() => setSensorForm({ open: true, point })}
                onRemoveSensor={() => sensorRemoval.open(point)}
              />
            ))}
          </Box>
        )}
      </Stack>

      <MachineFormDialog
        open={editingMachine}
        machine={editableMachine}
        onClose={() => setEditingMachine(false)}
        onSaved={(saved) => {
          setEditingMachine(false);
          setNotice(`Machine "${saved.name}" updated.`);
          void dispatch(fetchMachineDetail(current.id));
        }}
      />

      <PointFormDialog
        open={pointForm.open}
        machineId={current.id}
        point={pointForm.point}
        onClose={() => setPointForm((form) => ({ ...form, open: false }))}
        onSaved={(name, action) => {
          setPointForm((form) => ({ ...form, open: false }));
          setNotice(`Monitoring point "${name}" ${action}.`);
        }}
      />

      <SensorFormDialog
        open={sensorForm.open}
        machineType={current.type}
        point={sensorForm.point}
        onClose={() => setSensorForm((form) => ({ ...form, open: false }))}
        onSaved={({ serialNumber }) => {
          setNotice(
            `Sensor ${serialNumber} added to "${sensorForm.point?.name}".`,
          );
          setSensorForm((form) => ({ ...form, open: false }));
        }}
      />

      <ConfirmDialog
        open={pointDeletion.isOpen}
        title="Delete monitoring point?"
        confirmLabel="Delete"
        pending={pointDeletion.pending}
        error={pointDeletion.error}
        onClose={pointDeletion.close}
        onConfirm={() => void confirmPointDeletion()}
        message={
          pointDeletion.target && (
            <DeletePointMessage
              point={pointDeletion.target}
              readings={deletionCount}
            />
          )
        }
      />

      <ConfirmDialog
        open={sensorRemoval.isOpen}
        title="Remove sensor?"
        confirmLabel="Remove"
        pending={sensorRemoval.pending}
        error={sensorRemoval.error}
        onClose={sensorRemoval.close}
        onConfirm={() => void confirmSensorRemoval()}
        message={
          sensorRemoval.target && (
            <RemoveSensorMessage
              point={sensorRemoval.target}
              readings={removalCount}
            />
          )
        }
      />

      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default MachineDetailPage;

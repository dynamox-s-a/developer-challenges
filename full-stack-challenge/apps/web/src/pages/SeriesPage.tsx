import type { MonitoringPointListItemDto } from '@dynapredict/shared-types';
import ArrowBack from '@mui/icons-material/ArrowBack';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type ReactNode, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MetricsCards } from '../components/MetricsCards';
import { NoticeSnackbar } from '../components/NoticeSnackbar';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { PredictionControls } from '../features/readings/PredictionControls';
import { RangeFilter } from '../features/readings/RangeFilter';
import {
  deleteReadings,
  loadPrediction,
  loadReadings,
  MAX_CHART_POINTS,
  rangeChanged,
  selectSensorReadings,
} from '../features/readings/readingsSlice';
import { UploadReadingsPanel } from '../features/readings/UploadReadingsPanel';
import { useConfirmation } from '../hooks/useConfirmation';
import { type ApiError, toApiError } from '../services/apiClient';
import { getMonitoringPoint } from '../services/monitoringPointsApi';
import type { TimeRange } from '../services/readingsApi';
import { formatDateTime, formatNumber, pluralize } from '../utils/format';

type PointState =
  | { status: 'loading' }
  | { status: 'failed'; error: ApiError }
  | { status: 'ready'; point: MonitoringPointListItemDto };

/** The point behind the URL, with its machine and sensor. */
function useMonitoringPoint(id: string) {
  const [state, setState] = useState<PointState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    getMonitoringPoint(id).then(
      (point) => active && setState({ status: 'ready', point }),
      (error) =>
        active && setState({ status: 'failed', error: toApiError(error) }),
    );
    return () => {
      active = false;
    };
  }, [id, attempt]);

  return { state, retry: () => setAttempt((n) => n + 1) };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={id}
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Typography id={id} component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function rangeText(range: TimeRange): string | null {
  if (range.from && range.to) {
    return `between ${formatDateTime(range.from)} and ${formatDateTime(range.to)}`;
  }
  if (range.from) return `from ${formatDateTime(range.from)} on`;
  if (range.to) return `up to ${formatDateTime(range.to)}`;
  return null;
}

/** Upload, chart, metrics, forecast and deletion of one sensor's readings. */
function SensorSeries({
  point,
  sensorId,
}: {
  point: MonitoringPointListItemDto;
  sensorId: string;
}) {
  const dispatch = useAppDispatch();
  const readings = useAppSelector((state) =>
    selectSensorReadings(state, sensorId),
  );
  const deletion = useConfirmation<{ range: TimeRange; count: number }>();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(loadReadings(sensorId));
    void dispatch(loadPrediction(sensorId));
  }, [dispatch, sensorId]);

  const applyRange = (range: TimeRange) => {
    dispatch(rangeChanged({ sensorId, range }));
    void dispatch(loadReadings(sensorId));
  };

  const confirmDeletion = async () => {
    const done = await deletion.run(({ range }) =>
      dispatch(deleteReadings({ sensorId, range })).unwrap(),
    );
    if (done) setNotice('Readings deleted.');
  };

  const { range, metrics, status, error } = readings;
  const count = metrics?.count ?? 0;
  const loading = status === 'loading';
  const filtered = rangeText(range);
  const sensor = point.sensor;

  return (
    <Stack spacing={3}>
      <Section id="series-heading" title="Series">
        <Stack spacing={2}>
          <RangeFilter range={range} onApply={applyRange} disabled={loading} />
          {error && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => void dispatch(loadReadings(sensorId))}
                >
                  Retry
                </Button>
              }
            >
              {error.message}
            </Alert>
          )}
          <MetricsCards metrics={metrics} loading={loading} />
          {readings.truncated && (
            <Alert severity="info">
              The chart shows the first {formatNumber(MAX_CHART_POINTS)} of{' '}
              {formatNumber(count)} readings. The metrics cover all of them;
              narrow the time range to see the rest in the chart.
            </Alert>
          )}
          {status === 'idle' || (loading && !metrics) ? (
            <Box
              role="status"
              aria-label="Loading readings"
              sx={{ display: 'grid', placeItems: 'center', py: 6 }}
            >
              <CircularProgress aria-hidden />
            </Box>
          ) : (
            <TimeSeriesChart
              readings={readings.series}
              forecast={readings.prediction?.data ?? []}
              loading={loading}
            />
          )}
        </Stack>
      </Section>

      <Section id="forecast-heading" title="Forecast">
        <PredictionControls sensorId={sensorId} />
      </Section>

      <Section id="upload-heading" title="Upload readings">
        <UploadReadingsPanel
          sensorId={sensorId}
          onUploaded={(fileName, result) =>
            setNotice(
              `${fileName}: ${pluralize(result.inserted, 'new reading')} stored${
                result.duplicates > 0
                  ? `, ${pluralize(result.duplicates, 'duplicate')} skipped`
                  : ''
              }.`,
            )
          }
        />
      </Section>

      <Section id="delete-heading" title="Delete readings">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { sm: 'center' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filtered
              ? `Deletes the ${pluralize(count, 'reading')} ${filtered} (the selected range).`
              : `Deletes all ${pluralize(count, 'reading')} of sensor ${sensor?.serialNumber}.`}{' '}
            Permanent.
          </Typography>
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteOutline />}
            disabled={count === 0 || loading}
            onClick={() => deletion.open({ range, count })}
            sx={{ minHeight: 44, flexShrink: 0 }}
          >
            {filtered ? 'Delete range' : 'Delete all'}
          </Button>
        </Stack>
      </Section>

      <ConfirmDialog
        open={deletion.isOpen}
        title="Delete readings?"
        confirmLabel="Delete"
        pending={deletion.pending}
        error={deletion.error}
        onClose={deletion.close}
        onConfirm={() => void confirmDeletion()}
        message={
          deletion.target && (
            <>
              {pluralize(deletion.target.count, 'reading')} of sensor{' '}
              <strong>{sensor?.serialNumber}</strong>
              {rangeText(deletion.target.range)
                ? ` ${rangeText(deletion.target.range)}`
                : ''}{' '}
              will be permanently deleted. This can&apos;t be undone.
            </>
          )
        }
      />
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export function SeriesPage() {
  const { id = '' } = useParams();
  const { state, retry } = useMonitoringPoint(id);

  if (state.status === 'loading') {
    return (
      <Box
        role="status"
        aria-label="Loading monitoring point"
        sx={{ display: 'grid', placeItems: 'center', py: 8 }}
      >
        <CircularProgress aria-hidden />
      </Box>
    );
  }

  if (state.status === 'failed') {
    const notFound = state.error.status === 404;
    return (
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography component="h1" variant="h4">
          {notFound ? 'Monitoring point not found' : 'Time series'}
        </Typography>
        <Alert
          severity="error"
          action={
            notFound ? undefined : (
              <Button color="inherit" size="small" onClick={retry}>
                Retry
              </Button>
            )
          }
        >
          {notFound
            ? 'This monitoring point does not exist or was deleted.'
            : state.error.message}
        </Alert>
        <Link component={RouterLink} to="/monitoring-points">
          Monitoring points
        </Link>
      </Stack>
    );
  }

  const { point } = state;
  const machinePath = `/machines/${point.machine.id}`;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Link
          component={RouterLink}
          to={machinePath}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            minHeight: 44,
            alignSelf: 'flex-start',
          }}
        >
          <ArrowBack fontSize="small" aria-hidden />
          {point.machine.name}
        </Link>
        <Typography
          component="h1"
          variant="h4"
          sx={{ wordBreak: 'break-word' }}
        >
          {point.name}
        </Typography>
        <Typography color="text.secondary">
          {point.sensor
            ? `Sensor ${point.sensor.serialNumber} (${point.sensor.model}) · ${point.machine.type} ${point.machine.name}`
            : `${point.machine.type} ${point.machine.name}`}
        </Typography>
      </Stack>

      {point.sensor ? (
        <SensorSeries point={point} sensorId={point.sensor.id} />
      ) : (
        <Alert severity="info">
          This point has no sensor, so it has no readings.{' '}
          <Link component={RouterLink} to={machinePath}>
            Add a sensor on the machine page
          </Link>
          .
        </Alert>
      )}
    </Stack>
  );
}

export default SeriesPage;

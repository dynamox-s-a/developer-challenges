import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonitoringPointDto } from '@dynamox/shared';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/PageHeader';
import { monitoringPointsApi } from '../services/api';
import {
  clearTimeSeriesError,
  deleteTimeSeries,
  fetchTimeSeries,
  resetTimeSeries,
  storeTimeSeries,
} from '../features/timeSeries/timeSeriesSlice';

function buildSampleReadings(count = 24) {
  const start = Date.now() - count * 60_000;
  return Array.from({ length: count }, (_, index) => {
    const base = 40 + Math.sin(index / 3) * 8;
    const noise = (Math.random() - 0.5) * 4;
    return {
      timestamp: new Date(start + index * 60_000).toISOString(),
      value: Number((base + noise).toFixed(2)),
    };
  });
}

export function TimeSeriesPage() {
  const { pointId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { readings, metrics, forecast, globalCount, status, mutationStatus, error } =
    useAppSelector((state) => state.timeSeries);

  const [point, setPoint] = useState<MonitoringPointDto | null>(null);
  const [pointError, setPointError] = useState<string | null>(null);
  const [manualValue, setManualValue] = useState('42.5');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(clearTimeSeriesError());
    dispatch(resetTimeSeries());

    if (!pointId) return;

    monitoringPointsApi
      .get(pointId)
      .then((data) => {
        setPoint(data);
        setPointError(null);
      })
      .catch((err: { message?: string }) => {
        setPoint(null);
        setPointError(err.message ?? 'Monitoring point not found');
      });

    dispatch(fetchTimeSeries({ pointId }));

    return () => {
      dispatch(resetTimeSeries());
    };
  }, [dispatch, pointId]);

  const chartData = useMemo(() => {
    const actual = readings.map((reading) => ({
      label: new Date(reading.timestamp).toLocaleTimeString(),
      actual: reading.value,
      predicted: null as number | null,
    }));

    const predicted =
      forecast?.predictions.map((point) => ({
        label: new Date(point.timestamp).toLocaleTimeString(),
        actual: null as number | null,
        predicted: point.value,
      })) ?? [];

    // Connect forecast to the last actual point for a continuous dashed line
    if (actual.length > 0 && predicted.length > 0) {
      actual[actual.length - 1] = {
        ...actual[actual.length - 1],
        predicted: actual[actual.length - 1].actual,
      };
    }

    return [...actual, ...predicted];
  }, [readings, forecast]);

  const handleStoreSample = async () => {
    if (!pointId) return;
    const result = await dispatch(
      storeTimeSeries({ pointId, payload: { readings: buildSampleReadings() } })
    );
    if (storeTimeSeries.fulfilled.match(result)) {
      dispatch(fetchTimeSeries({ pointId }));
    }
  };

  const handleStoreManual = async (event: FormEvent) => {
    event.preventDefault();
    if (!pointId) return;
    const value = Number(manualValue);
    if (Number.isNaN(value)) return;

    const result = await dispatch(
      storeTimeSeries({
        pointId,
        payload: {
          readings: [{ timestamp: new Date().toISOString(), value }],
        },
      })
    );
    if (storeTimeSeries.fulfilled.match(result)) {
      dispatch(fetchTimeSeries({ pointId }));
    }
  };

  const handleDelete = async () => {
    if (!pointId) return;
    const result = await dispatch(deleteTimeSeries({ pointId }));
    if (deleteTimeSeries.fulfilled.match(result)) {
      setConfirmDeleteOpen(false);
      dispatch(fetchTimeSeries({ pointId }));
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Time-series"
        subtitle={
          point
            ? `${point.machineName} (${point.machineType}) · ${point.name}${
                point.sensorModel ? ` · ${point.sensorModel}` : ''
              }`
            : 'Sensor readings'
        }
        actions={
          <Button component={RouterLink} to="/monitoring-points" variant="outlined">
            Back to points
          </Button>
        }
      />

      {(error || pointError) && <Alert severity="error">{error || pointError}</Alert>}

      {point && !point.sensorId && (
        <Alert severity="warning">
          This monitoring point has no sensor yet. Associate a sensor before storing readings.
        </Alert>
      )}

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }}
      >
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Point readings
            </Typography>
            <Typography variant="h4">{metrics?.count ?? '—'}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Min / Max
            </Typography>
            <Typography variant="h5">
              {metrics?.min ?? '—'} / {metrics?.max ?? '—'}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Average
            </Typography>
            <Typography variant="h5">
              {metrics?.avg != null ? metrics.avg.toFixed(2) : '—'}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Global readings
            </Typography>
            <Typography variant="h4">{globalCount ?? '—'}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chart {forecast ? `(+ ${forecast.horizon}-step linear forecast)` : ''}
          </Typography>
          {status === 'loading' && readings.length === 0 ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : chartData.length === 0 ? (
            <Typography color="text.secondary">No readings yet.</Typography>
          ) : (
            <Box height={320}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" minTickGap={24} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#0B3A5B"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Forecast"
                    stroke="#00A3A1"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
          {forecast && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Method: {forecast.method} · history {forecast.historyCount} · interval{' '}
              {forecast.intervalMs}ms
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Ingest data</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleStoreSample}
                disabled={!point?.sensorId || mutationStatus === 'loading'}
              >
                Store sample series (24 points)
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={!pointId || (metrics?.count ?? 0) === 0 || mutationStatus === 'loading'}
              >
                Delete all readings
              </Button>
            </Box>
            <Box
              component="form"
              onSubmit={handleStoreManual}
              display="flex"
              gap={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <TextField
                label="Manual value"
                type="number"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                size="small"
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={!point?.sensorId || mutationStatus === 'loading'}
              >
                Append reading now
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete time-series"
        description="Delete all stored readings for this monitoring point?"
        confirmLabel="Delete"
        loading={mutationStatus === 'loading'}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

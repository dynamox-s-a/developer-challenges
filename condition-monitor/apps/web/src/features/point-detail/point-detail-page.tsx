import {
  FORECAST,
  locationLabel,
  type Forecast,
  type SeriesMetrics,
  type TimeSeriesSummary,
} from '@condition-monitor/shared';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteSeries,
  fetchForecasts,
  fetchPointDetail,
  fetchSeriesData,
  forecastToggled,
  periodChanged,
  PERIODS,
  type Period,
} from './point-detail-slice';
import { SeriesChart } from './series-chart';

const number = (value: number) => value.toLocaleString('en-US');

/** A measured value, or "n/a" when nothing was measured: never a zero in its place (C7). */
function measured(value: number | null): string {
  return value === null ? 'n/a' : value.toLocaleString('en-US', { maximumFractionDigits: 3 });
}

/** Series of the same quantity share a chart, as the API lists them: by quantity. */
function byQuantity(series: TimeSeriesSummary[]): TimeSeriesSummary[][] {
  const groups = new Map<string, TimeSeriesSummary[]>();
  for (const item of series) {
    groups.set(item.quantity, [...(groups.get(item.quantity) ?? []), item]);
  }
  return [...groups.values()];
}

const available = (forecast: Forecast | undefined) =>
  forecast?.status === 'available' ? forecast : undefined;

/**
 * What each forecast is worth, in words: how far it was from what happened on history it
 * had not seen, beside the error of simply repeating yesterday. A forecast that is not
 * better than that is said to be so, and a series without one says why.
 */
function ForecastNotes({
  series,
  forecasts,
  title,
}: {
  series: TimeSeriesSummary[];
  forecasts: Record<string, Forecast>;
  title: string;
}) {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Dashed: the hourly mean expected. Shaded: where {Math.round(FORECAST.bandCoverage * 100)} %
        of the forecasts of this series fell when tried on its own history.
      </Typography>
      <Box component="ul" aria-label={`${title} forecast`} sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
        {series.map((item) => {
          const forecast = forecasts[item.id];
          if (!forecast) return null;
          if (forecast.status === 'unavailable') {
            return (
              <Typography component="li" variant="body2" key={item.id}>
                {item.label}: no forecast. {forecast.detail}
              </Typography>
            );
          }
          const { error, baselineError } = forecast.validation;
          const better = error < baselineError;
          return (
            <Typography
              component="li"
              variant="body2"
              key={item.id}
              color={better ? 'text.primary' : 'warning.main'}
            >
              {item.label}: missed by {measured(error)} {item.unit} on average;{' '}
              {"repeating yesterday's hour"} misses by {measured(baselineError)} {item.unit}.
              {!better && ' Not better than repeating yesterday: do not rely on it.'}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
}

const METRIC_COLUMNS: { key: keyof SeriesMetrics; label: string }[] = [
  { key: 'min', label: 'Min' },
  { key: 'max', label: 'Max' },
  { key: 'mean', label: 'Mean' },
  { key: 'stdDev', label: 'Std dev' },
  { key: 'rms', label: 'RMS' },
];

/**
 * A monitoring point and its time-series: a chart per quantity, the metrics of each
 * series over the chosen period, and the deletion of a series (challenge, section 7).
 */
export function PointDetailPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { point, series, status, error, period, data, forecast } = useAppSelector(
    (state) => state.pointDetail,
  );
  const [deleting, setDeleting] = useState<TimeSeriesSummary | null>(null);

  useEffect(() => {
    void dispatch(fetchPointDetail(id));
  }, [dispatch, id]);

  // The data follows the series and the period: a deletion or a new period reloads it.
  useEffect(() => {
    if (status === 'loaded' && series.length > 0) {
      void dispatch(fetchSeriesData({ series, period }));
    }
  }, [dispatch, status, series, period]);

  // Forecasts are asked for only while shown, and again when the series change.
  useEffect(() => {
    if (forecast.shown && status === 'loaded' && series.length > 0) {
      void dispatch(fetchForecasts(series));
    }
  }, [dispatch, forecast.shown, status, series]);

  if (status === 'failed') {
    return <RetryAlert message={error} onRetry={() => void dispatch(fetchPointDetail(id))} />;
  }
  if (!point || point.id !== id) {
    return <LoadingIndicator label="Loading monitoring point" />;
  }

  const confirmDelete = async () => {
    if (!deleting) return null;
    const result = await dispatch(deleteSeries({ pointId: point.id, seriesId: deleting.id }));
    return deleteSeries.rejected.match(result)
      ? (result.payload?.message ?? 'Could not delete the time-series.')
      : null;
  };

  return (
    <>
      <Typography variant="h5" component="h1">
        {point.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        <Link component={RouterLink} to={`/machines/${point.machine.id}`}>
          {point.machine.tag}
        </Link>{' '}
        {point.machine.name}, {locationLabel(point.location)}.{' '}
        {point.sensor
          ? `Sensor ${point.sensor.serialNumber} (${point.sensor.model}).`
          : 'No sensor installed.'}
      </Typography>

      {series.length === 0 ? (
        <Alert severity="info">
          No readings stored for this point yet.{' '}
          <Link component={RouterLink} to="/import">
            Import a CSV file
          </Link>{' '}
          or run the simulator.
        </Alert>
      ) : (
        <>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={period}
              aria-label="Period"
              onChange={(_event, value: Period | null) => value && dispatch(periodChanged(value))}
            >
              {PERIODS.map((item) => (
                <ToggleButton key={item.key} value={item.key}>
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {period !== 'all' && (
              <Typography variant="body2" color="text.secondary">
                Ending at the latest reading of the point.
              </Typography>
            )}
            <FormControlLabel
              sx={{ ml: 'auto' }}
              label={`Forecast the next ${FORECAST.horizonHours} h`}
              control={
                <Switch
                  checked={forecast.shown}
                  onChange={(_event, checked) => dispatch(forecastToggled(checked))}
                />
              }
            />
          </Stack>

          {forecast.shown && forecast.status === 'failed' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {forecast.error}
            </Alert>
          )}

          {data.status === 'failed' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {data.error}
            </Alert>
          )}

          {byQuantity(series).map((group) => {
            const title = group[0].label.split(',')[0];
            const loaded = group.every((item) => data.readings[item.id]);
            const downsampled = group.some((item) => data.readings[item.id]?.downsampled);
            return (
              <Paper key={group[0].quantity} component="section" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {title} ({group[0].unit})
                </Typography>
                {loaded ? (
                  <SeriesChart
                    title={title}
                    unit={group[0].unit}
                    series={group.map((item) => ({
                      label: item.label,
                      axis: item.axis,
                      answer: data.readings[item.id],
                      forecast: forecast.shown ? available(forecast.bySeries[item.id]) : undefined,
                    }))}
                  />
                ) : (
                  <Box sx={{ height: 280, display: 'grid', placeItems: 'center' }}>
                    <CircularProgress aria-label={`Loading ${title}`} />
                  </Box>
                )}
                {forecast.shown && forecast.status === 'loaded' && (
                  <ForecastNotes series={group} forecasts={forecast.bySeries} title={title} />
                )}
                {downsampled && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Condensed for display: each vertical stroke spans the minimum and maximum of the
                    readings it stands for, so peaks stay visible.
                  </Typography>
                )}
                <TableContainer sx={{ mt: 1 }}>
                  <Table size="small" aria-label={`${title} metrics`}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Series</TableCell>
                        <TableCell align="right">Readings</TableCell>
                        {METRIC_COLUMNS.map((column) => (
                          <TableCell key={column.key} align="right">
                            {column.label}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          <Box component="span" sx={visuallyHidden}>
                            Actions
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.map((item) => {
                        const metrics = data.metrics[item.id];
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell align="right">
                              {metrics ? number(metrics.count) : '…'}
                            </TableCell>
                            {METRIC_COLUMNS.map((column) => (
                              <TableCell key={column.key} align="right">
                                {metrics ? measured(metrics[column.key] as number | null) : '…'}
                              </TableCell>
                            ))}
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                aria-label={`Delete ${item.label}`}
                                onClick={() => setDeleting(item)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            );
          })}
          <Typography variant="body2" color="text.secondary">
            Metrics cover the chosen period. Std dev is the population standard deviation. Times are
            shown in this browser&apos;s time zone.
          </Typography>
        </>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete time-series"
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting &&
          `${deleting.label} and its ${number(deleting.readingCount)} readings will be removed. A later reading of it creates the series again.`}
      </ConfirmDialog>
    </>
  );
}

/**
 * Read by screen readers, not shown. Units are explicit: in `sx`, a bare 1 means 100%
 * for a width and a spacing step for a margin, not one pixel.
 */
const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;

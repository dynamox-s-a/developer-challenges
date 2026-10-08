import type { ReadingDto } from '@dynapredict/shared-types';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useId, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  axisTimeFormatter,
  formatDateTime,
  formatNumber,
  pluralize,
} from '../utils/format';

/** One x position: the measured value, the forecast, or both at the seam. */
interface ChartPoint {
  t: number;
  reading?: number;
  forecast?: number;
}

/**
 * Merges both series on one time axis. The forecast starts at the last
 * reading so its line continues the measured one without a gap.
 */
export function toChartPoints(
  readings: ReadingDto[],
  forecast: ReadingDto[],
): ChartPoint[] {
  const points: ChartPoint[] = readings.map((r) => ({
    t: Date.parse(r.timestamp),
    reading: r.value,
  }));
  if (forecast.length > 0 && points.length > 0) {
    const seam = points[points.length - 1];
    seam.forecast = seam.reading;
  }
  for (const f of forecast) {
    points.push({ t: Date.parse(f.timestamp), forecast: f.value });
  }
  return points;
}

/** The text alternative: what the chart shows, in one sentence. */
export function describeChart(
  readings: ReadingDto[],
  forecast: ReadingDto[],
): string {
  if (readings.length === 0) return 'No readings to plot.';
  let min = Infinity;
  let max = -Infinity;
  for (const { value } of readings) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const parts = [
    `Line chart of ${pluralize(readings.length, 'reading')} from ${formatDateTime(
      readings[0].timestamp,
    )} to ${formatDateTime(readings[readings.length - 1].timestamp)}`,
    `ranging from ${formatNumber(min)} to ${formatNumber(max)}`,
  ];
  if (forecast.length > 0) {
    parts.push(
      `followed by a forecast of ${pluralize(forecast.length, 'point')} ending at ${formatNumber(
        forecast[forecast.length - 1].value,
      )}`,
    );
  }
  return `${parts.join(', ')}.`;
}

interface SeriesKeyProps {
  color: string;
  dashed?: boolean;
}

/** A short stroke in the series colour: legends and tooltips key by line. */
function SeriesKey({ color, dashed = false }: SeriesKeyProps) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'inline-block',
        width: 18,
        borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
        verticalAlign: 'middle',
      }}
    />
  );
}

interface TooltipBodyProps {
  active?: boolean;
  label?: number | string;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
}

/** Values lead, series names follow; text in text tokens, never series colour. */
function TooltipBody({ active, label, payload }: TooltipBodyProps) {
  const theme = useTheme();
  if (!active || !payload?.length || label === undefined) return null;
  const rows = payload.filter((p) => typeof p.value === 'number');
  return (
    <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
      <Typography variant="caption" color="text.secondary">
        {formatDateTime(new Date(Number(label)).toISOString())}
      </Typography>
      {rows.map((row) => {
        const isForecast = row.dataKey === 'forecast';
        return (
          <Stack
            key={String(row.dataKey)}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <SeriesKey
              color={
                isForecast
                  ? theme.palette.chart.forecast
                  : theme.palette.chart.readings
              }
              dashed={isForecast}
            />
            <Typography variant="body2" fontWeight={600}>
              {formatNumber(row.value as number)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isForecast ? 'Forecast' : 'Reading'}
            </Typography>
          </Stack>
        );
      })}
    </Paper>
  );
}

const TABLE_ROWS = 200;

export interface TimeSeriesChartProps {
  readings: ReadingDto[];
  forecast?: ReadingDto[];
  /** Dims the previous render while new data loads, instead of flashing. */
  loading?: boolean;
}

/**
 * The sensor's series as a line, plus the forecast as a dashed line in a
 * second colour (dash and legend keep the two apart without colour). Colours
 * come from `theme.palette.chart`; the axes and grid use text and divider
 * tokens. A summary sentence and a table view make it readable without
 * seeing the chart.
 */
export function TimeSeriesChart({
  readings,
  forecast = [],
  loading = false,
}: TimeSeriesChartProps) {
  const theme = useTheme();
  const summaryId = useId();
  const [showTable, setShowTable] = useState(false);

  const points = useMemo(
    () => toChartPoints(readings, forecast),
    [readings, forecast],
  );
  const summary = useMemo(
    () => describeChart(readings, forecast),
    [readings, forecast],
  );
  const formatTick = useMemo(() => {
    const span =
      points.length > 1 ? points[points.length - 1].t - points[0].t : 0;
    return axisTimeFormatter(span);
  }, [points]);

  if (readings.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          minHeight: 160,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
        }}
      >
        <Typography color="text.secondary">
          No readings to plot yet. Upload a file to see the series.
        </Typography>
      </Box>
    );
  }

  const axisText = { fill: theme.palette.text.secondary, fontSize: 12 };
  const tableRows = [
    ...readings.slice(-TABLE_ROWS).map((r) => ({ ...r, kind: 'Reading' })),
    ...forecast.map((f) => ({ ...f, kind: 'Forecast' })),
  ];

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: 'wrap', alignItems: 'center' }}
        aria-label="Legend"
        role="list"
      >
        <Stack
          role="listitem"
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center' }}
        >
          <SeriesKey color={theme.palette.chart.readings} />
          <Typography variant="body2">Readings</Typography>
        </Stack>
        {forecast.length > 0 && (
          <Stack
            role="listitem"
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <SeriesKey color={theme.palette.chart.forecast} dashed />
            <Typography variant="body2">Forecast</Typography>
          </Stack>
        )}
      </Stack>

      <Box
        component="figure"
        aria-label="Readings chart"
        aria-describedby={summaryId}
        sx={{
          m: 0,
          // ResponsiveContainer re-measures a tick after a resize; until then
          // the old width must not make the page scroll sideways.
          overflow: 'hidden',
          minWidth: 0,
          height: { xs: 260, md: 360 },
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 150ms',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTick}
              tick={axisText}
              stroke={theme.palette.divider}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={axisText}
              stroke={theme.palette.divider}
              width={56}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={<TooltipBody />}
              cursor={{ stroke: theme.palette.text.secondary, strokeWidth: 1 }}
            />
            <Line
              dataKey="reading"
              name="Readings"
              type="linear"
              stroke={theme.palette.chart.readings}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{
                r: 4,
                stroke: theme.palette.background.paper,
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={false}
            />
            {forecast.length > 0 && (
              <Line
                dataKey="forecast"
                name="Forecast"
                type="linear"
                stroke={theme.palette.chart.forecast}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Typography id={summaryId} variant="body2" color="text.secondary">
        {summary}
      </Typography>

      <Box>
        <Button
          size="small"
          onClick={() => setShowTable((shown) => !shown)}
          aria-expanded={showTable}
          sx={{ minHeight: 44 }}
        >
          {showTable ? 'Hide data table' : 'Show data table'}
        </Button>
        {showTable && (
          <TableContainer sx={{ maxHeight: 320, overflow: 'auto' }}>
            <Table size="small" stickyHeader aria-label="Chart data">
              <caption>
                {readings.length > TABLE_ROWS
                  ? `Latest ${TABLE_ROWS} of ${readings.length} readings`
                  : pluralize(readings.length, 'reading')}
                {forecast.length > 0 &&
                  `, then ${pluralize(forecast.length, 'forecast point')}`}
                .
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell>Series</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow key={`${row.kind}-${row.timestamp}`}>
                    <TableCell>{formatDateTime(row.timestamp)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatNumber(row.value)}
                    </TableCell>
                    <TableCell>{row.kind}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  );
}

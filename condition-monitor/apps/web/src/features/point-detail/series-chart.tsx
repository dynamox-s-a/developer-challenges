import type { ForecastAvailable, ReadingsAnswer } from '@condition-monitor/shared';
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';

// Only what a line over time needs, so the rest of Chart.js stays out of the bundle.
// Filler shades the band of a forecast.
ChartJS.register(LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ChartPoint = { x: number; y: number | null };

/**
 * The points to draw. A bucket becomes two points at its middle, its minimum and its
 * maximum, so the line spans the whole range the readings covered there, peaks
 * included. Where consecutive points are much further apart than usual, a null breaks
 * the line: a gap in the data stays visible instead of being bridged by a straight line.
 */
export function chartPoints(answer: ReadingsAnswer): ChartPoint[] {
  const points: ChartPoint[] = answer.downsampled
    ? answer.buckets.flatMap((bucket) => {
        const middle = (Date.parse(bucket.start) + Date.parse(bucket.end)) / 2;
        return [
          { x: middle, y: bucket.min },
          { x: middle, y: bucket.max },
        ];
      })
    : answer.readings.map((reading) => ({ x: Date.parse(reading.timestamp), y: reading.value }));

  const steps = points
    .slice(1)
    .map((point, index) => point.x - points[index].x)
    .filter((step) => step > 0)
    .sort((a, b) => a - b);
  if (steps.length === 0) return points;
  const usual = steps[Math.floor(steps.length / 2)];

  return points.flatMap((point, index) => {
    const previous = points[index - 1];
    return previous && point.x - previous.x > 3 * usual
      ? [{ x: (previous.x + point.x) / 2, y: null }, point]
      : [point];
  });
}

/** One color per axis, the same in every chart of the page. */
const COLORS: Record<string, string> = {
  H: '#1f77b4',
  V: '#ff7f0e',
  A: '#2ca02c',
  none: '#d62728',
};

export interface ChartSeries {
  label: string;
  axis: string | null;
  answer: ReadingsAnswer;
  /** Drawn after the readings when present. */
  forecast?: ForecastAvailable;
}

/** Marks the datasets that only shade the band, to keep them out of the legend. */
const BAND = ' (band)';

/**
 * A forecast as three datasets: the lower edge of its band, the upper edge filled down
 * to the lower one, and the predicted line, dashed so it is never taken for a
 * measurement.
 */
export function forecastDatasets(label: string, color: string, forecast: ForecastAvailable) {
  const at = (pick: (point: ForecastAvailable['points'][number]) => number) =>
    forecast.points.map((point) => ({ x: Date.parse(point.timestamp), y: pick(point) }));
  const edge = { borderWidth: 0, pointRadius: 0, pointHitRadius: 0 };
  return [
    {
      ...edge,
      label: `${label}${BAND} lower`,
      data: at((point) => point.lower),
      borderColor: color,
      backgroundColor: `${color}33`,
      fill: false as const,
    },
    {
      ...edge,
      label: `${label}${BAND} upper`,
      data: at((point) => point.upper),
      borderColor: color,
      backgroundColor: `${color}33`,
      // Shades down to the dataset just before: the lower edge.
      fill: '-1' as const,
    },
    {
      label: `${label}, forecast`,
      data: at((point) => point.value),
      borderColor: color,
      backgroundColor: color,
      borderDash: [6, 4],
      fill: false as const,
    },
  ];
}

/** A quantity over time, one line per axis, in the browser's local time (ADR 0009). */
export function SeriesChart({
  title,
  unit,
  series,
}: {
  title: string;
  unit: string;
  series: ChartSeries[];
}) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    parsing: false,
    normalized: true,
    interaction: { mode: 'nearest', intersect: false },
    scales: {
      x: { type: 'time', time: { tooltipFormat: 'yyyy-MM-dd HH:mm' } },
      y: { title: { display: true, text: unit } },
    },
    elements: { point: { radius: 0 }, line: { borderWidth: 1.5 } },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { filter: (item) => !item.text.includes(BAND) },
      },
      tooltip: { filter: (item) => !(item.dataset.label ?? '').includes(BAND) },
    },
  };

  return (
    <Box sx={{ position: 'relative', height: 280 }}>
      <Line
        aria-label={`${title} chart, in ${unit}`}
        role="img"
        options={options}
        data={{
          datasets: series.flatMap((item) => {
            const color = COLORS[item.axis ?? 'none'];
            return [
              {
                label: item.label,
                data: chartPoints(item.answer),
                borderColor: color,
                backgroundColor: color,
                spanGaps: false,
              },
              ...(item.forecast ? forecastDatasets(item.label, color, item.forecast) : []),
            ];
          }),
        }}
      />
    </Box>
  );
}

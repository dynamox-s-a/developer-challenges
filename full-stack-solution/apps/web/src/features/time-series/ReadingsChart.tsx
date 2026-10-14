import { useMemo } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  METRIC_LABELS,
  METRIC_UNITS,
  metricWithUnit,
  type MeasurementMetric,
  type Reading,
} from "@full-stack-solution/shared";
import { formatAxisTimestamp, formatNumber, formatTimestamp } from "@web/utils/format";

export interface ReadingsChartProps {
  /** Readings of a single quantity, ordered by timestamp. */
  readings: Reading[];
  /** The quantity being plotted; drives the Y axis label and the units. */
  metric: MeasurementMetric;
  height?: number;
}

/** Shows samples individually only while they are distinguishable. */
const MAX_DOTS = 80;

/**
 * The value as the tooltip shows it: the number and its unit.
 *
 * This owns the whole string. Recharts can append a unit of its own, from the
 * `unit` prop of the series, right after whatever the formatter returns — so
 * setting both renders the unit twice.
 */
export function formatReadingValue(
  value: number,
  metric: MeasurementMetric,
): string {
  return `${formatNumber(value, 3)} ${METRIC_UNITS[metric]}`;
}

/**
 * Line chart of one quantity of a time series.
 *
 * The X axis is a **numeric time scale** (`type="number"` + `scale="time"`),
 * not a category axis: with the timestamps as categories, Recharts spaces
 * every sample evenly, so a one-second gap and a one-week gap look identical.
 * Measurements arrive at irregular intervals, so the position of a point has
 * to come from its instant.
 *
 * One chart plots one quantity. Temperature and vibration share no unit and no
 * range, so putting them on a single axis would invite reading one as the
 * other.
 */
export function ReadingsChart({
  readings,
  metric,
  height = 320,
}: ReadingsChartProps) {
  const theme = useTheme();

  const { data, spanMs } = useMemo(() => {
    const points = readings.map((reading) => ({
      // Epoch milliseconds: what a time scale needs to place a sample.
      timestamp: Date.parse(reading.timestamp),
      value: reading.value,
    }));

    const first = points[0]?.timestamp ?? 0;
    const last = points[points.length - 1]?.timestamp ?? 0;

    return { data: points, spanMs: Math.max(0, last - first) };
  }, [readings]);

  return (
    <Box sx={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={theme.palette.divider} vertical={false} />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => formatAxisTimestamp(value, spanMs)}
            stroke={theme.palette.text.secondary}
            fontSize={12}
            // Keeps the axis from crowding: Recharts drops ticks that would
            // land closer than this.
            minTickGap={48}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            fontSize={12}
            width={72}
            tickFormatter={(value: number) => formatNumber(Number(value), 1)}
            label={{
              value: metricWithUnit(metric),
              angle: -90,
              position: "insideLeft",
              style: {
                fill: theme.palette.text.secondary,
                fontSize: 12,
                textAnchor: "middle",
              },
            }}
          />
          <Tooltip
            labelFormatter={(label) =>
              formatTimestamp(new Date(Number(label)).toISOString())
            }
            formatter={(value) => [
              formatReadingValue(Number(value), metric),
              METRIC_LABELS[metric],
            ]}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
          <Legend verticalAlign="top" height={28} />
          <Line
            type="monotone"
            name={METRIC_LABELS[metric]}
            dataKey="value"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={data.length <= MAX_DOTS}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

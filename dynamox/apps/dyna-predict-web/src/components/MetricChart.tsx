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

interface MetricChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  label: string;
  unit: string;
  color: string;
}

function MetricChart({ data, dataKey, label, unit, color }: MetricChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} unit={` ${unit}`} width={65} />
        <Tooltip formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)} ${unit}`, label]} />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={label}
          stroke={color}
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MetricChart;

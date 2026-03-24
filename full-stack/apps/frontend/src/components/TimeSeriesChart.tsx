import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface TimeSeriesData {
  timestamp: string;
  value: number;
}

interface TimeSeriesChartProps {
  monitoringPointId: string;
  title: string;
}

const TIME_RANGES = [
  { value: "24h", label: "Last 24 hours", hours: 24 },
  { value: "7d", label: "Last 7 days", hours: 24 * 7 },
  { value: "30d", label: "Last 30 days", hours: 24 * 30 },
];

export default function TimeSeriesChart({ monitoringPointId, title }: TimeSeriesChartProps) {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [metrics, setMetrics] = useState<{ min: number; max: number; avg: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    fetchData();
  }, [monitoringPointId, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const selectedRange = TIME_RANGES.find(r => r.value === timeRange);
      const to = new Date();
      const from = new Date(to.getTime() - (selectedRange?.hours || 24) * 60 * 60 * 1000);

      // Fetch time series data
      const seriesResponse = await fetch(
        `http://localhost:3001/monitoring-points/${monitoringPointId}/time-series?from=${from.toISOString()}&to=${to.toISOString()}&take=500`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!seriesResponse.ok) {
        throw new Error('Failed to fetch time series data');
      }

      const seriesData = await seriesResponse.json();

      // Fetch metrics
      const metricsResponse = await fetch(
        `http://localhost:3001/monitoring-points/${monitoringPointId}/time-series/metrics?from=${from.toISOString()}&to=${to.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const metricsData = metricsResponse.ok ? await metricsResponse.json() : null;

      setData(seriesData.items || []);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching time series:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatXAxis = (tickItem: any) => {
    const date = new Date(tickItem);
    return format(date, timeRange === "24h" ? "HH:mm" : "MM/dd");
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography>Loading...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {TIME_RANGES.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {metrics && (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip 
              label={`Min: ${metrics.min.toFixed(2)}`} 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={`Max: ${metrics.max.toFixed(2)}`} 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={`Avg: ${metrics.avg.toFixed(2)}`} 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={`Count: ${metrics.count}`} 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
          </Stack>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => [`Time: ${value}`, 'Value:']}
              formatter={(value: any) => [formatXAxis(value), value?.toFixed(2)]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#1976d2" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

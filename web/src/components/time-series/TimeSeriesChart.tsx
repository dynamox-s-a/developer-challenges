'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TimeSeriesDataPoint } from '@/types/zod/timeSeries'
import { format } from 'date-fns'

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  height?: number
}

export default function TimeSeriesChart({
  data,
  height = 400,
}: TimeSeriesChartProps) {
  const chartData = data.map(point => ({
    ...point,
    time: format(new Date(point.timestamp), 'dd/MM HH:mm'),
  }))

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

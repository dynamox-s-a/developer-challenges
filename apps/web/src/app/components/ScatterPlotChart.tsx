import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchTimeSeries, clearTimeSeries } from '../store/slices/timeSeriesSlice';

interface ScatterPlotChartProps {
  sensorId: string;
}

export const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({ sensorId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.timeSeries);

  useEffect(() => {
    if (sensorId) {
      dispatch(fetchTimeSeries(sensorId));
    }
    return () => {
      dispatch(clearTimeSeries());
    };
  }, [dispatch, sensorId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (data.length === 0) {
    return (
      <Typography align="center" sx={{ p: 3 }}>
        No data available for this sensor.
      </Typography>
    );
  }

  const formattedData = data.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp).getTime(), // Scatter chart needs numeric X
    formattedTime: new Date(point.timestamp).toLocaleString(),
  }));

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="timestamp"
            name="Time"
            domain={['auto', 'auto']}
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
          />
          <YAxis type="number" dataKey="value" name="Value" />
          <ZAxis type="number" range={[60, 60]} /> {/* Fixed point size */}
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            labelFormatter={(unixTime) => new Date(unixTime).toLocaleString()}
          />
          <Legend />
          <Scatter name="Sensor Readings" data={formattedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};

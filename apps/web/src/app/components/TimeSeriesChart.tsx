import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Box, CircularProgress, Typography, Button, Card, CardContent } from '@mui/material';
import { AutoGraph as PredictIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchTimeSeries, clearTimeSeries, fetchPrediction } from '../store/slices/timeSeriesSlice';

interface TimeSeriesChartProps {
  sensorId: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ sensorId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, prediction } = useSelector((state: RootState) => state.timeSeries);

  useEffect(() => {
    if (sensorId) {
      dispatch(fetchTimeSeries(sensorId));
    }
    return () => {
      dispatch(clearTimeSeries());
    };
  }, [dispatch, sensorId]);

  const handlePredict = () => {
    dispatch(fetchPrediction(sensorId));
  };

  if (loading && data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && data.length === 0) {
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
    formattedTime: new Date(point.timestamp).toLocaleString(),
    isPrediction: false,
  }));

  if (prediction) {
    formattedData.push({
      id: 'prediction',
      sensorId,
      value: prediction.predictedValue,
      timestamp: prediction.nextTimestamp,
      formattedTime: new Date(prediction.nextTimestamp).toLocaleString() + ' (Pred)',
      isPrediction: true,
    });
  }

  // Calculate dynamic thresholds based on data range for demo purposes
  // In a real app, these would come from the sensor configuration
  const maxVal = Math.max(...data.map((d) => d.value));
  const alertThreshold = maxVal * 0.8;
  const criticalThreshold = maxVal * 0.9;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PredictIcon />}
          onClick={handlePredict}
          disabled={loading || data.length < 2}
        >
          Predict Next Value
        </Button>
      </Box>

      {prediction && (
        <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Prediction Result
            </Typography>
            <Typography variant="h6">
              Value: {prediction.predictedValue}
            </Typography>
            <Typography variant="body2">
              Time: {new Date(prediction.nextTimestamp).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Confidence: {prediction.confidence}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={alertThreshold} label="Alert" stroke="orange" strokeDasharray="3 3" />
            <ReferenceLine y={criticalThreshold} label="Critical" stroke="red" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Sensor Value"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isPrediction) {
                  return <circle cx={cx} cy={cy} r={6} fill="red" stroke="none" />;
                }
                return <circle cx={cx} cy={cy} r={0} fill="#8884d8" />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

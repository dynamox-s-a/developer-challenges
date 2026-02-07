import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, Card, CardContent, MenuItem, TextField, Tabs, Tab } from '@mui/material';
import {
  PrecisionManufacturing as MachineIcon,
  Sensors as SensorIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchMachines } from '@/app/store/slices/machinesSlice';
import { fetchMonitoringPoints } from '@/app/store/slices/monitoringPointsSlice';
import { TimeSeriesChart } from '@/app/components/TimeSeriesChart';
import { ScatterPlotChart } from '@/app/components/ScatterPlotChart';
import { TimeSeriesDataForm } from '@/app/components/TimeSeriesDataForm';
import type { MonitoringPoint } from '@/app/types';

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const machines = useSelector((state: RootState) => state.machines.items);
  const monitoringPoints = useSelector((state: RootState) => state.monitoringPoints.items);
  const monitoringPointsTotal = useSelector((state: RootState) => state.monitoringPoints.total);
  
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchMachines());
    // Fetch a few monitoring points to populate the dropdown for the chart
    dispatch(fetchMonitoringPoints({ page: 1, limit: 100 })); 
  }, [dispatch]);

  useEffect(() => {
    // Select the first point with a sensor by default
    if (monitoringPoints.length > 0 && !selectedPointId) {
      const pointWithSensor = monitoringPoints.find(p => p.sensor);
      if (pointWithSensor && pointWithSensor.sensor) {
        setSelectedPointId(pointWithSensor.sensor.id);
      }
    }
  }, [monitoringPoints, selectedPointId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const stats = [
    {
      title: 'Total Machines',
      value: machines.length,
      icon: <MachineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Monitoring Points',
      value: monitoringPointsTotal || monitoringPoints.length, // Fallback if total isn't updated yet
      icon: <SensorIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
  ];

  const pointsWithSensors = monitoringPoints.filter(p => p.sensor);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Sensor Data Visualization
          </Typography>
          <TextField
            select
            label="Select Sensor"
            value={selectedPointId}
            onChange={(e) => setSelectedPointId(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            {pointsWithSensors.map((point) => (
              <MenuItem key={point.sensor!.id} value={point.sensor!.id}>
                {point.name} ({point.sensor!.model})
              </MenuItem>
            ))}
            {pointsWithSensors.length === 0 && (
              <MenuItem value="" disabled>
                No sensors available
              </MenuItem>
            )}
          </TextField>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="chart tabs">
            <Tab label="Trend Analysis" />
            <Tab label="Anomaly Detection (Scatter)" />
          </Tabs>
        </Box>
        
        {selectedPointId ? (
          <>
            <TimeSeriesDataForm sensorId={selectedPointId} />
            {tabValue === 0 && <TimeSeriesChart sensorId={selectedPointId} />}
            {tabValue === 1 && <ScatterPlotChart sensorId={selectedPointId} />}
          </>
        ) : (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="textSecondary">
              Select a sensor to view data
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

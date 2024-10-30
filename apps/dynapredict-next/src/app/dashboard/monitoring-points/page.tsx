'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import DidYouKnow from '@/components/dashboard/did-you-know';
import { ListMonitoringPoints } from '@/components/dashboard/monitoring-points/list-monitoring-points';
import { MonitoringPointsForm } from '@/components/dashboard/monitoring-points/monitoring-points-form';
import SensorsImages from '@/components/dashboard/monitoring-points/sensors-images';

export default function Page(): React.JSX.Element {
  const mockMachines = [
    { id: '1', name: 'Pump Station Alpha' },
    { id: '2', name: 'Conveyor Belt XJ-2' },
    { id: '3', name: 'Industrial Fan F-103' },
  ];

  const mockMonitoringPoints = [
    {
      id: '1',
      name: 'Bearing Vibration',
      type: 'Vibration',
      machineId: '1',
      machineName: 'Pump Station Alpha',
      sensorId: null,
      isEnabled: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Motor Temperature',
      type: 'Temperature',
      machineId: '1',
      machineName: 'Pump Station Alpha',
      sensorId: 'sensor-1',
      isEnabled: true,
      createdAt: new Date(),
    },
  ];

  const mockSensors = [
    { id: 'sensor-1', name: 'TcAg' },
    { id: 'sensor-2', name: 'TcAs' },
    { id: 'sensor-3', name: 'HF+' },
  ];

  const [editingPointId, setEditingPointId] = useState<string | null>(null);

  const handleSensorChange = (monitoringPointId: string, sensorId: string) => {
    console.log('Sensor changed for point:', monitoringPointId, 'to sensor:', sensorId);
  };

  const handleToggleEdit = (monitoringPointId: string) => {
    setEditingPointId((current) => (current === monitoringPointId ? null : monitoringPointId));
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 2, sm: 1 }}>
        <MonitoringPointsForm machines={mockMachines} />
      </Grid>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 1, sm: 2 }}>
        <DidYouKnow
          message={
            'Monitoring points are your resources to manage sensors and which machine they track. With our brand new line of sensors, you can now have comprehensive machine health tracking and early problem detection.'
          }
        >
          <SensorsImages />
        </DidYouKnow>
      </Grid>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <ListMonitoringPoints
          monitoringPoints={mockMonitoringPoints}
          availableSensors={mockSensors}
          onSensorChange={handleSensorChange}
          onToggleEdit={handleToggleEdit}
          editingPointId={editingPointId}
        />
      </Grid>
    </Grid>
  );
}

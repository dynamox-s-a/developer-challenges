'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { MonitoringPoint } from '@/types/data-types';
import { useAssignSensorMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';

const availableSensors = [
  { model: 'TcAg', allowedForMachineTypes: ['Fan'] },
  { model: 'TcAs', allowedForMachineTypes: ['Fan'] },
  { model: 'HF+', allowedForMachineTypes: ['Fan', 'Pump'] },
];

interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[];
}

export default function MonitoringPointsTable({ monitoringPoints }: MonitoringPointsTableProps): React.JSX.Element {
  const [editingPointId, setEditingPointId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ pointId: number; success: boolean } | null>(null);
  const [optimisticSensors, setOptimisticSensors] = useState<Record<number, string>>({});
  const { checkSession } = useUser();
  const [assignSensor, { isLoading: isChanging }] = useAssignSensorMutation();

  const onSensorChange = async (monitoringPointId: number, sensorName: string) => {
    if (sensorName === 'default') {
      return;
    }
    try {
      setOptimisticSensors((prev) => ({ ...prev, [monitoringPointId]: sensorName }));
      await checkSession?.();
      await assignSensor({ pointId: monitoringPointId, model: sensorName }).unwrap();
      setShowFeedback({ pointId: monitoringPointId, success: true });
      setEditingPointId(null);
    } catch (error) {
      setOptimisticSensors((prev) => ({
        ...prev,
        [monitoringPointId]: prev[monitoringPointId] || 'default',
      }));
      console.error('Failed to assign sensor:', error);
      setShowFeedback({ pointId: monitoringPointId, success: false });
    }
  };

  const onToggleEdit = (monitoringPointId: number) => {
    setShowFeedback(null);
    setEditingPointId(editingPointId === monitoringPointId ? null : monitoringPointId);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Sensor Assignment</TableCell>
          <TableCell>Monitoring Point</TableCell>
          <TableCell>Machine Name</TableCell>
          <TableCell>Machine Type</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {monitoringPoints?.map((point) => (
          <TableRow hover key={point.id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '200px' }}>
                <Select
                  size="small"
                  value={optimisticSensors[point.id] || point.sensor?.model || 'default'}
                  onChange={(e) => onSensorChange(point.id, e.target.value as string)}
                  disabled={editingPointId !== point.id || isChanging}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor:
                        showFeedback?.pointId === point.id
                          ? showFeedback.success
                            ? 'success.main'
                            : 'error.main'
                          : 'inherit',
                    },
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                      borderColor:
                        showFeedback?.pointId === point.id
                          ? showFeedback.success
                            ? 'success.main'
                            : 'error.main'
                          : 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  <MenuItem value="default" disabled>
                    <em>Sensor</em>
                  </MenuItem>
                  {availableSensors.map((sensor) => {
                    const isAllowed = sensor.allowedForMachineTypes.includes(point.machine.type);
                    const convert = sensor.model === 'HF+' ? 'HFPlus' : sensor.model;
                    return (
                      <MenuItem key={sensor.model} value={convert} disabled={!isAllowed}>
                        {sensor.model}
                      </MenuItem>
                    );
                  })}
                </Select>
                <Tooltip title={editingPointId === point.id ? 'Disable Assignment' : 'Enable Assignment'}>
                  <IconButton
                    onClick={() => onToggleEdit?.(point.id)}
                    color={editingPointId === point.id ? 'primary' : 'default'}
                  >
                    <PencilSimple weight={editingPointId === point.id ? 'fill' : 'regular'} />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell>{point.name}</TableCell>
            <TableCell>{point.machine.name}</TableCell>
            <TableCell>{point.machine.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
